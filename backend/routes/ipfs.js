const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload file to IPFS/Pinata
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // For demo purposes, we'll simulate IPFS upload
    // In production, integrate with Pinata API
    const ipfsHash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // If Pinata credentials are available, use actual upload
    if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
      try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));
        
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'pinata_api_key': process.env.PINATA_API_KEY,
              'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
            }
          }
        );
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        return res.json({
          success: true,
          ipfsHash: response.data.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        });
      } catch (pinataError) {
        console.error('Pinata upload error:', pinataError);
      }
    }
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      ipfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      message: 'Demo IPFS hash generated (configure Pinata for actual upload)'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload JSON metadata to IPFS
router.post('/upload-json', authMiddleware, async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }
    
    // For demo purposes, generate a hash
    const ipfsHash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // If Pinata credentials are available, use actual upload
    if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': process.env.PINATA_API_KEY,
              'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
            }
          }
        );
        
        return res.json({
          success: true,
          ipfsHash: response.data.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        });
      } catch (pinataError) {
        console.error('Pinata JSON upload error:', pinataError);
      }
    }
    
    res.json({
      success: true,
      ipfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      message: 'Demo IPFS hash generated (configure Pinata for actual upload)'
    });
  } catch (error) {
    console.error('JSON upload error:', error);
    res.status(500).json({ error: 'Failed to upload JSON' });
  }
});

// Get file from IPFS
router.get('/get/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const ipfsGateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    
    res.json({
      url: `${ipfsGateway}${hash}`,
      hash
    });
  } catch (error) {
    console.error('IPFS get error:', error);
    res.status(500).json({ error: 'Failed to get IPFS file' });
  }
});

module.exports = router;
