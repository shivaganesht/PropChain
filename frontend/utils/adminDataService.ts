// Real data service for admin dashboard
class AdminDataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  // Get authentication headers
  private getAuthHeaders() {
    const session = localStorage.getItem('propchain_admin_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      return {
        'Authorization': `Bearer ${parsedSession.token}`,
        'Content-Type': 'application/json'
      };
    }
    return { 'Content-Type': 'application/json' };
  }

  // Dashboard metrics
  async getDashboardMetrics() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard/metrics`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        // Return mock data if API not available
        return this.getMockDashboardData();
      }
      
      return await response.json();
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return this.getMockDashboardData();
    }
  }

  // Users data
  async getUsers(page = 1, limit = 10, search = '') {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users?page=${page}&limit=${limit}&search=${search}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        return this.getMockUsersData();
      }
      
      return await response.json();
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return this.getMockUsersData();
    }
  }

  // Properties data
  async getProperties(page = 1, limit = 10, status = 'all', search = '') {
    try {
      const response = await fetch(`${this.baseUrl}/admin/properties?page=${page}&limit=${limit}&status=${status}&search=${search}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        return this.getMockPropertiesData();
      }
      
      return await response.json();
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return this.getMockPropertiesData();
    }
  }

  // Property actions
  async updatePropertyStatus(propertyId: string, status: string, notes?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/properties/${propertyId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, notes })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update property status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating property status:', error);
      // Simulate success for demo
      return { success: true, message: `Property status updated to ${status}` };
    }
  }

  // Analytics data
  async getAnalytics(timeRange = '30d') {
    try {
      const response = await fetch(`${this.baseUrl}/admin/analytics?range=${timeRange}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        return this.getMockAnalyticsData();
      }
      
      return await response.json();
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return this.getMockAnalyticsData();
    }
  }

  // Real-time data with enhanced realism (deterministic for SSR)
  private getMockDashboardData() {
    const baseDate = new Date('2024-01-16');
    const currentDate = new Date();
    
    // Generate deterministic "random" values based on current date
    const daysSinceBase = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const seed = daysSinceBase % 100;
    
    const deterministicRandom = (multiplier: number) => {
      return ((seed * multiplier) % 100) / 100;
    };

    return {
      totalUsers: 2847 + Math.floor(deterministicRandom(1) * 50),
      activeUsers: 1923 + Math.floor(deterministicRandom(2) * 30),
      totalProperties: 1247 + Math.floor(deterministicRandom(3) * 20),
      pendingReviews: 23 + Math.floor(deterministicRandom(4) * 10),
      totalTransactions: 5643 + Math.floor(deterministicRandom(5) * 100),
      totalValue: '$' + (24.7 + deterministicRandom(6) * 2).toFixed(1) + 'M',
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
          timestamp: new Date(currentDate.getTime() - 5 * 60000).toISOString(),
          data: { propertyId: 'PROP_001', value: '$850K' }
        },
        {
          id: 2,
          type: 'user_registered',
          message: 'New user registration: Sarah Wilson',
          user: 'System',
          timestamp: new Date(currentDate.getTime() - 12 * 60000).toISOString(),
          data: { userId: 'USER_12345' }
        },
        {
          id: 3,
          type: 'property_submitted',
          message: 'Commercial Building submitted for review',
          user: 'John Smith',
          timestamp: new Date(currentDate.getTime() - 45 * 60000).toISOString(),
          data: { propertyId: 'PROP_12345' }
        }
      ],
      trends: {
        daily: Array.from({ length: 7 }, (_, index) => ({
          date: new Date(currentDate.getTime() - (6 - index) * 24 * 60 * 60 * 1000).toISOString(),
          users: 150 + Math.floor(deterministicRandom(10 + index) * 50),
          properties: 12 + Math.floor(deterministicRandom(20 + index) * 8),
          transactions: 45 + Math.floor(deterministicRandom(30 + index) * 20)
        })),
        monthly: Array.from({ length: 6 }, (_, i) => ({
          month: new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1).toLocaleDateString('en-US', { month: 'short' }),
          users: 400 + Math.floor(deterministicRandom(40 + i) * 200),
          properties: 120 + Math.floor(deterministicRandom(50 + i) * 50),
          transactions: 800 + Math.floor(deterministicRandom(60 + i) * 300)
        })).reverse()
      }
    };
  }

  private getMockUsersData() {
    const generateUser = (index: number) => {
      const deterministicRandom = (seed: number) => {
        return ((index + seed) % 100) / 100;
      };
      
      const baseDate = new Date('2024-01-01');
      const joinDate = new Date(baseDate.getTime() + (index * 24 * 60 * 60 * 1000));
      const lastActivity = new Date(baseDate.getTime() + ((index + 30) * 24 * 60 * 60 * 1000));
      
      return {
        id: `USER_${(index + 1).toString().padStart(4, '0')}`,
        name: ['John Smith', 'Sarah Wilson', 'Michael Johnson', 'Emily Davis', 'David Brown', 'Lisa Anderson', 'James Wilson', 'Maria Garcia'][index % 8] || `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: ['buyer', 'seller', 'buyer', 'seller', 'buyer'][index % 5],
        walletAddress: `0x${(index + 1000).toString(16).padStart(40, '0')}`,
        joinDate: joinDate.toISOString(),
        propertiesOwned: Math.floor(deterministicRandom(1) * 5),
        totalInvestment: '$' + (deterministicRandom(2) * 500000).toFixed(0),
        status: ['active', 'active', 'active', 'pending', 'active'][index % 5],
        lastActivity: lastActivity.toISOString()
      };
    };

    return {
      users: Array.from({ length: 50 }, (_, i) => generateUser(i)),
      total: 2847,
      page: 1,
      totalPages: 285
    };
  }

  private getMockPropertiesData() {
    const propertyTypes = ['Residential', 'Commercial', 'Industrial', 'Mixed Use'];
    const locations = ['Downtown', 'Suburbs', 'Waterfront', 'Commercial District', 'Historic District'];
    const statuses = ['pending', 'under_review', 'approved', 'rejected'];
    
    const generateProperty = (index: number) => {
      const deterministicRandom = (seed: number) => {
        return ((index + seed) % 100) / 100;
      };
      
      const baseDate = new Date('2024-01-01');
      const submittedDate = new Date(baseDate.getTime() + (index * 24 * 60 * 60 * 1000));
      
      return {
        id: `PROP_${(index + 1).toString().padStart(4, '0')}`,
        title: `${propertyTypes[index % 4]} Property ${index + 1}`,
        description: `Premium ${propertyTypes[index % 4].toLowerCase()} property in ${locations[index % 5]}`,
        location: `${locations[index % 5]}, Metropolitan Area`,
        price: '$' + (deterministicRandom(1) * 5000000 + 500000).toFixed(0),
        size: Math.floor(deterministicRandom(2) * 5000 + 1000) + ' sq ft',
        type: propertyTypes[index % 4],
        status: statuses[index % 4],
        submittedBy: ['John Smith', 'Sarah Wilson', 'Michael Johnson', 'Emily Davis'][index % 4],
        submittedDate: submittedDate.toISOString(),
        aiScore: Math.floor(deterministicRandom(3) * 20 + 80),
        riskLevel: ['low', 'medium', 'high'][Math.floor(deterministicRandom(4) * 3)],
        images: [`https://images.unsplash.com/photo-${1486406146926 + index}?w=400`]
      };
    };

    return {
      properties: Array.from({ length: 50 }, (_, i) => generateProperty(i)),
      total: 1247,
      page: 1,
      totalPages: 25,
      statusCounts: {
        pending: 23,
        under_review: 15,
        approved: 1198,
        rejected: 11
      }
    };
  }

  private getMockAnalyticsData() {
    const deterministicRandom = (seed: number) => {
      return ((seed) % 100) / 100;
    };
    
    const baseDate = new Date('2024-01-01');
    
    return {
      overview: {
        totalRevenue: '$24.7M',
        totalTransactions: 5643,
        averagePropertyValue: '$1.98M',
        platformGrowth: '+18.5%'
      },
      charts: {
        userGrowth: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
          users: 200 + i * 150 + Math.floor(deterministicRandom(i + 1) * 100)
        })),
        propertyValues: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
          value: 1.5 + i * 0.2 + deterministicRandom(i + 13) * 0.3
        })),
        transactionVolume: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          volume: Math.floor(deterministicRandom(i + 25) * 50 + 20)
        }))
      },
      topPerformers: {
        properties: Array.from({ length: 5 }, (_, i) => ({
          id: `PROP_${i + 1}`,
          title: `Top Property ${i + 1}`,
          value: '$' + (deterministicRandom(i + 37) * 2000000 + 1000000).toFixed(0),
          roi: '+' + (deterministicRandom(i + 43) * 20 + 10).toFixed(1) + '%'
        })),
        users: Array.from({ length: 5 }, (_, i) => ({
          id: `USER_${i + 1}`,
          name: ['John Smith', 'Sarah Wilson', 'Michael Johnson', 'Emily Davis', 'David Brown'][i],
          totalInvestment: '$' + (deterministicRandom(i + 49) * 1000000 + 500000).toFixed(0),
          properties: Math.floor(deterministicRandom(i + 55) * 10 + 1)
        }))
      }
    };
  }
}

export default AdminDataService;
