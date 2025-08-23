const express = require('express');
const router = express.Router();
const multer = require('multer');
const Land = require('../models/Land');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get all lands
router.get('/', async (req, res) => {
  try {
    const { status, propertyType, city, minPrice, maxPrice } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.pricePerTokenUSD = {};
      if (minPrice) filter.pricePerTokenUSD.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerTokenUSD.$lte = Number(maxPrice);
    }
    
    const lands = await Land.find(filter)
      .populate('seller', 'name email walletAddress')
      .sort('-createdAt');
    
    res.json(lands);
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ error: 'Failed to fetch lands' });
  }
});

// Get single land by ID
router.get('/:id', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id)
      .populate('seller', 'name email walletAddress')
      .populate('tokenHolders.user', 'name email walletAddress');
    
    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    res.json(land);
  } catch (error) {
    console.error('Error fetching land:', error);
    res.status(500).json({ error: 'Failed to fetch land' });
  }
});

// Create new land listing (protected)
router.post('/', authMiddleware, upload.array('documents', 10), async (req, res) => {
  try {
    const landData = {
      ...req.body,
      seller: req.userId,
      availableTokens: req.body.totalTokens,
      location: JSON.parse(req.body.location || '{}'),
      size: JSON.parse(req.body.size || '{}'),
      amenities: JSON.parse(req.body.amenities || '[]'),
      images: JSON.parse(req.body.images || '[]')
    };
    
    // Handle uploaded documents
    if (req.files && req.files.length > 0) {
      landData.documents = req.files.map(file => ({
        name: file.originalname,
        ipfsHash: '', // Will be updated after IPFS upload
        uploadedAt: new Date()
      }));
    }
    
    const land = new Land(landData);
    await land.save();
    
    res.status(201).json({
      message: 'Land listing created successfully',
      land
    });
  } catch (error) {
    console.error('Error creating land:', error);
    res.status(500).json({ error: 'Failed to create land listing' });
  }
});

// Update land listing (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    // Check if user is the seller
    if (land.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'seller' && key !== '_id') {
        land[key] = req.body[key];
      }
    });
    
    await land.save();
    
    res.json({
      message: 'Land updated successfully',
      land
    });
  } catch (error) {
    console.error('Error updating land:', error);
    res.status(500).json({ error: 'Failed to update land' });
  }
});

// Get lands by seller (protected)
router.get('/seller/:sellerId', authMiddleware, async (req, res) => {
  try {
    const lands = await Land.find({ seller: req.params.sellerId })
      .populate('tokenHolders.user', 'name email walletAddress')
      .sort('-createdAt');
    
    res.json(lands);
  } catch (error) {
    console.error('Error fetching seller lands:', error);
    res.status(500).json({ error: 'Failed to fetch seller lands' });
  }
});

// Update land after tokenization
router.post('/:id/tokenize', authMiddleware, async (req, res) => {
  try {
    const { blockchainId, transactionHash, metadataHash } = req.body;
    
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    // Check if user is the seller
    if (land.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    land.blockchainId = blockchainId;
    land.transactionHash = transactionHash;
    land.metadataHash = metadataHash;
    land.status = 'active';
    land.tokenizedAt = new Date();
    
    await land.save();
    
    res.json({
      message: 'Land tokenized successfully',
      land
    });
  } catch (error) {
    console.error('Error tokenizing land:', error);
    res.status(500).json({ error: 'Failed to tokenize land' });
  }
});

module.exports = router;
