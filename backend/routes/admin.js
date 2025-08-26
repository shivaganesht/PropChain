const express = require('express');
const router = express.Router();

// Demo data for admin dashboard
const mockData = {
  dashboard: {
    totalUsers: 2847,
    activeUsers: 1923,
    totalProperties: 1247,
    pendingReviews: 23,
    totalTransactions: 5643,
    totalValue: '$24.7M',
    monthlyGrowth: {
      users: '+12.5%',
      properties: '+8.3%',
      transactions: '+15.7%'
    },
    recentActivity: [
      {
        id: 1,
        type: 'property_approved',
        message: 'Luxury Downtown Condo approved',
        user: 'Admin',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        data: { propertyId: 'PROP_001', value: '$850K' }
      },
      {
        id: 2,
        type: 'user_registered',
        message: 'New user registration: Sarah Wilson',
        user: 'System',
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        data: { userId: 'USER_12345' }
      }
    ]
  },
  users: [
    {
      id: 'USER_0001',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'buyer',
      walletAddress: '0x1234567890123456789012345678901234567890',
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      propertiesOwned: 3,
      totalInvestment: '$125000',
      status: 'active',
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'USER_0002',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'seller',
      walletAddress: '0x0987654321098765432109876543210987654321',
      joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      propertiesOwned: 1,
      totalInvestment: '$75000',
      status: 'active',
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  properties: [
    {
      id: 'PROP_0001',
      title: 'Luxury Downtown Condo',
      description: 'Beautiful 2-bedroom condo in downtown Denver',
      location: 'Denver, CO',
      price: '$850000',
      size: '1200 sq ft',
      type: 'Residential',
      status: 'approved',
      submittedBy: 'John Smith',
      submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      aiScore: 92,
      riskLevel: 'low'
    },
    {
      id: 'PROP_0002',
      title: 'Commercial Office Space',
      description: 'Modern office space in business district',
      location: 'Boulder, CO',
      price: '$1200000',
      size: '2500 sq ft',
      type: 'Commercial',
      status: 'pending',
      submittedBy: 'Sarah Wilson',
      submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      aiScore: 87,
      riskLevel: 'medium'
    }
  ]
};

// Admin Dashboard Data
router.get('/dashboard', (req, res) => {
  try {
    res.json({ success: true, data: mockData.dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Users Data
router.get('/users', (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    let filteredUsers = mockData.users;
    if (search) {
      filteredUsers = mockData.users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        total: filteredUsers.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Properties Data
router.get('/properties', (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    
    let filteredProperties = mockData.properties;
    
    if (status) {
      filteredProperties = filteredProperties.filter(prop => prop.status === status);
    }
    
    if (search) {
      filteredProperties = filteredProperties.filter(prop => 
        prop.title.toLowerCase().includes(search.toLowerCase()) ||
        prop.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        properties: paginatedProperties,
        total: filteredProperties.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredProperties.length / limit),
        statusCounts: {
          pending: mockData.properties.filter(p => p.status === 'pending').length,
          under_review: mockData.properties.filter(p => p.status === 'under_review').length,
          approved: mockData.properties.filter(p => p.status === 'approved').length,
          rejected: mockData.properties.filter(p => p.status === 'rejected').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Property Status
router.put('/properties/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // In a real app, you would update the database
    console.log(`Updating property ${id} to status: ${status}`);
    
    res.json({
      success: true,
      message: `Property status updated to ${status}`,
      data: { id, status }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Analytics
router.get('/analytics', (req, res) => {
  try {
    const analyticsData = {
      overview: {
        totalRevenue: '$24.7M',
        totalTransactions: 5643,
        averagePropertyValue: '$1.98M',
        platformGrowth: '+18.5%'
      },
      charts: {
        userGrowth: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
          users: 200 + i * 150
        })),
        propertyValues: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
          value: 1.5 + i * 0.2
        }))
      }
    };
    
    res.json({ success: true, data: analyticsData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
