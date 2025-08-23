const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('landsSelling')
      .populate('transactions');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update through this route
    delete updates._id;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's owned lands
router.get('/lands', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.landsOwned);
  } catch (error) {
    console.error('Error fetching user lands:', error);
    res.status(500).json({ error: 'Failed to fetch user lands' });
  }
});

// Update user's land ownership
router.post('/lands/:landId', authMiddleware, async (req, res) => {
  try {
    const { tokenAmount, ownershipPercentage } = req.body;
    const { landId } = req.params;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user already owns tokens in this land
    const existingOwnership = user.landsOwned.find(
      land => land.landId === parseInt(landId)
    );
    
    if (existingOwnership) {
      // Update existing ownership
      existingOwnership.tokenAmount += tokenAmount;
      existingOwnership.ownershipPercentage = ownershipPercentage;
    } else {
      // Add new ownership
      user.landsOwned.push({
        landId: parseInt(landId),
        tokenAmount,
        ownershipPercentage
      });
    }
    
    await user.save();
    
    res.json({
      message: 'Land ownership updated',
      landsOwned: user.landsOwned
    });
  } catch (error) {
    console.error('Error updating land ownership:', error);
    res.status(500).json({ error: 'Failed to update land ownership' });
  }
});

module.exports = router;
