const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, walletAddress } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'buyer',
      walletAddress
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Connect wallet
router.post('/connect-wallet', async (req, res) => {
  try {
    const { walletAddress, email } = req.body;
    
    // Find user by email or wallet
    let user = await User.findOne({ 
      $or: [{ email }, { walletAddress }] 
    });
    
    if (!user && email) {
      // Create new user with wallet
      user = new User({
        name: walletAddress.substring(0, 6) + '...',
        email,
        password: Math.random().toString(36).slice(-8), // Random password
        walletAddress,
        role: 'buyer'
      });
      await user.save();
    } else if (user && !user.walletAddress) {
      // Update existing user with wallet
      user.walletAddress = walletAddress;
      await user.save();
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Wallet connected successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
});

module.exports = router;
