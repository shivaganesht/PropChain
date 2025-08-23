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
          title: 'Luxury Villa in Goa',
          description: 'Premium beachside villa with ocean view, private pool, and modern amenities',
          location: {
            city: 'Calangute',
            state: 'Goa',
            country: 'India'
          },
          size: {
            value: 4500,
            unit: 'sqft'
          },
          totalTokens: 1000,
          availableTokens: 750,
          pricePerTokenUSD: 150,
          propertyType: 'residential',
          images: [],
          status: 'active',
          seller: {
            _id: '1',
            name: 'Rajesh Kumar',
            email: 'rajesh@propchain.in',
            walletAddress: '0x1234...5678'
          }
        },
        {
          _id: '2',
          title: 'Mumbai Business Center',
          description: 'Prime commercial space in Bandra Kurla Complex with excellent connectivity',
          location: {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India'
          },
          size: {
            value: 8000,
            unit: 'sqft'
          },
          totalTokens: 2000,
          availableTokens: 1200,
          pricePerTokenUSD: 250,
          propertyType: 'commercial',
          images: [],
          status: 'active',
          seller: {
            _id: '2',
            name: 'Priya Sharma',
            email: 'priya@propchain.in',
            walletAddress: '0x2345...6789'
          }
        },
        {
          _id: '3',
          title: 'Bangalore Tech Park',
          description: 'Modern IT office space in Whitefield with 24/7 facilities',
          location: {
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India'
          },
          size: {
            value: 12000,
            unit: 'sqft'
          },
          totalTokens: 1500,
          availableTokens: 900,
          pricePerTokenUSD: 200,
          propertyType: 'commercial',
          images: [],
          status: 'active',
          seller: {
            _id: '3',
            name: 'Amit Patel',
            email: 'amit@propchain.in',
            walletAddress: '0x3456...7890'
          }
        },
        {
          _id: '4',
          title: 'Delhi NCR Apartments',
          description: 'Luxury 3BHK apartments in Gurgaon with clubhouse and amenities',
          location: {
            city: 'Gurgaon',
            state: 'Haryana',
            country: 'India'
          },
          size: {
            value: 2200,
            unit: 'sqft'
          },
          totalTokens: 800,
          availableTokens: 600,
          pricePerTokenUSD: 180,
          propertyType: 'residential',
          images: [],
          status: 'active',
          seller: {
            _id: '4',
            name: 'Neha Singh',
            email: 'neha@propchain.in',
            walletAddress: '0x4567...8901'
          }
        },
        {
          _id: '5',
          title: 'Punjab Agricultural Land',
          description: 'Fertile farmland in Punjab with irrigation facilities',
          location: {
            city: 'Ludhiana',
            state: 'Punjab',
            country: 'India'
          },
          size: {
            value: 15,
            unit: 'acres'
          },
          totalTokens: 2500,
          availableTokens: 2000,
          pricePerTokenUSD: 80,
          propertyType: 'agricultural',
          images: [],
          status: 'active',
          seller: {
            _id: '5',
            name: 'Harpreet Kaur',
            email: 'harpreet@propchain.in',
            walletAddress: '0x5678...9012'
          }
        },
        {
          _id: '6',
          title: 'Hyderabad IT Hub',
          description: 'State-of-the-art office complex in HITEC City',
          location: {
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India'
          },
          size: {
            value: 10000,
            unit: 'sqft'
          },
          totalTokens: 1800,
          availableTokens: 1000,
          pricePerTokenUSD: 220,
          propertyType: 'commercial',
          images: [],
          status: 'active',
          seller: {
            _id: '6',
            name: 'Venkat Reddy',
            email: 'venkat@propchain.in',
            walletAddress: '0x6789...0123'
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
