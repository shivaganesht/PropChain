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
    // Check if in demo mode
    if (process.env.USE_DEMO_MODE === 'true') {
      // Return demo data
      const demoLands = [
        {
          _id: '1',
          title: 'Downtown Commercial Building',
          description: 'Prime commercial property in city center',
          location: {
            city: 'Denver',
            state: 'Colorado',
            country: 'USA'
          },
          size: {
            value: 5000,
            unit: 'sqft'
          },
          totalTokens: 1000,
          availableTokens: 750,
          pricePerTokenUSD: 100,
          propertyType: 'commercial',
          images: [],
          status: 'active',
          seller: {
            _id: '1',
            name: 'Demo Seller',
            email: 'seller@demo.com',
            walletAddress: '0x1234...5678'
          }
        },
        {
          _id: '2',
          title: 'Suburban Family Home',
          description: 'Beautiful 4-bedroom home in quiet neighborhood',
          location: {
            city: 'Boulder',
            state: 'Colorado',
            country: 'USA'
          },
          size: {
            value: 2500,
            unit: 'sqft'
          },
          totalTokens: 500,
          availableTokens: 300,
          pricePerTokenUSD: 200,
          propertyType: 'residential',
          images: [],
          status: 'active',
          seller: {
            _id: '2',
            name: 'John Doe',
            email: 'john@demo.com',
            walletAddress: '0x2345...6789'
          }
        },
        {
          _id: '3',
          title: 'Agricultural Land',
          description: 'Fertile farmland with water rights',
          location: {
            city: 'Fort Collins',
            state: 'Colorado',
            country: 'USA'
          },
          size: {
            value: 10,
            unit: 'acres'
          },
          totalTokens: 2000,
          availableTokens: 1500,
          pricePerTokenUSD: 50,
          propertyType: 'agricultural',
          images: [],
          status: 'active',
          seller: {
            _id: '3',
            name: 'Farm Owner',
            email: 'farm@demo.com',
            walletAddress: '0x3456...7890'
          }
        }
      ];
      
      // Apply filters to demo data
      let filteredLands = demoLands;
      const { status, propertyType, city, minPrice, maxPrice } = req.query;
      
      if (status) {
        filteredLands = filteredLands.filter(land => land.status === status);
      }
      if (propertyType) {
        filteredLands = filteredLands.filter(land => land.propertyType === propertyType);
      }
      if (city) {
        filteredLands = filteredLands.filter(land => 
          land.location.city.toLowerCase().includes(city.toLowerCase())
        );
      }
      if (minPrice) {
        filteredLands = filteredLands.filter(land => land.pricePerTokenUSD >= Number(minPrice));
      }
      if (maxPrice) {
        filteredLands = filteredLands.filter(land => land.pricePerTokenUSD <= Number(maxPrice));
      }
      
      return res.json(filteredLands);
    }
    
    // Normal database query
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
    // Return empty array instead of error in demo mode
    res.json([]);
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
