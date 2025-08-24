'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Users, 
  Building, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Bot,
  FileText,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  DollarSign,
  Activity,
  Bell
} from 'lucide-react';
import AdminDataService from '../../../utils/adminDataService';

// Mock admin authentication
const useAdminAuth = () => ({
  isAdmin: true,
  adminId: 'admin_001',
  adminName: 'Admin User'
});

// Animated Background Component (reused)
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>
  </div>
);

// Futuristic Card Component (reused)
const FuturisticCard = ({
  children,
  className = "",
  hover = true
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <div className={`
    relative group
    backdrop-blur-md bg-white/5 border border-white/10
    rounded-2xl p-6 
    ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:scale-105' : ''}
    transition-all duration-500 ease-out
    shadow-xl hover:shadow-cyan-500/10
    before:absolute before:inset-0 before:rounded-2xl 
    before:bg-gradient-to-r before:from-cyan-500/10 before:to-purple-500/10
    before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
    ${className}
  `}>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Admin Stats Card
const AdminStatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color, 
  trend,
  delay = 0 
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  trend?: string;
  delay?: number;
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <FuturisticCard className={`transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} backdrop-blur-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className={`text-3xl font-bold bg-gradient-to-r ${color.replace('from-', 'from-').replace('to-', 'to-')} bg-clip-text text-transparent transition-all duration-700 ${animate ? 'scale-100' : 'scale-90'}`}>
          {value}
        </p>
        <p className="text-sm text-gray-300">{subtitle}</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} animate-pulse`}></div>
          <span className="text-xs text-gray-400">{title}</span>
        </div>
      </div>
    </FuturisticCard>
  );
};

// Property Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
    under_review: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Eye },
    ai_analysis: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Bot },
    approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
    active: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: TrendingUp }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

// Quick Actions Panel
const QuickActions = () => {
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'review':
        window.location.href = '/admin/properties/review';
        break;
      case 'ai':
        window.location.href = '/admin/analytics';
        break;
      case 'users':
        window.location.href = '/admin/users';
        break;
      case 'settings':
        window.location.href = '/admin/settings';
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <FuturisticCard hover={false}>
      <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-cyan-400" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Review Properties', icon: FileText, color: 'from-blue-500 to-cyan-500', action: 'review' },
          { label: 'AI Analysis', icon: Bot, color: 'from-purple-500 to-pink-500', action: 'ai' },
          { label: 'User Management', icon: Users, color: 'from-green-500 to-emerald-500', action: 'users' },
          { label: 'Platform Settings', icon: Settings, color: 'from-orange-500 to-yellow-500', action: 'settings' }
        ].map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action.action)}
            className={`p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-20 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group`}
          >
            <action.icon className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-100">{action.label}</p>
          </button>
        ))}
      </div>
    </FuturisticCard>
  );
};

// Recent Activity Feed
const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'approval', message: 'Property "Modern Office Complex" approved', time: '5 min ago', status: 'approved' },
    { id: 2, type: 'ai_analysis', message: 'AI analysis completed for "Luxury Apartment"', time: '12 min ago', status: 'ai_analysis' },
    { id: 3, type: 'submission', message: 'New property submitted for review', time: '1 hour ago', status: 'pending' },
    { id: 4, type: 'rejection', message: 'Property "Old Building" rejected', time: '2 hours ago', status: 'rejected' }
  ];

  return (
    <FuturisticCard hover={false}>
      <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        Recent Activity
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={activity.id} className={`p-3 rounded-lg bg-white/5 border border-white/10 transform transition-all duration-500 ${index % 2 === 0 ? 'translate-x-0' : 'translate-x-2'} opacity-100`}>
            <div className="flex items-center justify-between mb-2">
              <StatusBadge status={activity.status} />
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
            <p className="text-sm text-gray-200">{activity.message}</p>
          </div>
        ))}
      </div>
    </FuturisticCard>
  );
};

// Admin Dashboard Main Component
export default function AdminDashboard() {
  const { isAdmin, adminName } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const dataService = new AdminDataService();

  // Optimized data fetching with caching
  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await dataService.getDashboardMetrics();
      setDashboardData(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data load with auto-refresh
  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleExportReport = () => {
    if (!dashboardData) return;
    
    const csvContent = [
      ['PropChain Admin Dashboard Report - ' + new Date().toLocaleDateString()],
      ['Generated on', new Date().toISOString()],
      [''],
      ['Summary Statistics'],
      ['Total Users', dashboardData.totalUsers],
      ['Active Users', dashboardData.activeUsers],
      ['Total Properties', dashboardData.totalProperties],
      ['Pending Reviews', dashboardData.pendingReviews],
      ['Total Transactions', dashboardData.totalTransactions],
      ['Total Platform Value', dashboardData.totalValue],
      [''],
      ['Monthly Growth'],
      ['User Growth', dashboardData.monthlyGrowth.users],
      ['Property Growth', dashboardData.monthlyGrowth.properties],
      ['Transaction Growth', dashboardData.monthlyGrowth.transactions],
      [''],
      ['Recent Activity'],
      ['Type', 'Message', 'User', 'Time'],
      ...dashboardData.recentActivity.map((activity: any) => [
        activity.type,
        activity.message,
        activity.user,
        new Date(activity.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propchain_dashboard_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAnalytics = () => {
    window.location.href = '/admin/analytics';
  };

  const handlePropertyAction = async (propertyId: string, action: string, propertyName: string) => {
    try {
      await dataService.updatePropertyStatus(propertyId, action);
      alert(`Property "${propertyName}" ${action === 'approved' ? 'approved' : 'rejected'} successfully!`);
      // Refresh data after action
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property. Please try again.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <FuturisticCard className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-400">Admin privileges required to access this dashboard.</p>
        </FuturisticCard>
      </div>
    );
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <FuturisticCard className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">Loading Dashboard</h2>
          <p className="text-gray-400">Fetching real-time data...</p>
        </FuturisticCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg">PropChain Platform Management</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Welcome back, {adminName}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-100 hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              onClick={handleExportReport}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-gray-100 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button 
              onClick={handleAnalytics}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AdminStatsCard 
            icon={Users}
            title="Total Users"
            value={dashboardData?.totalUsers?.toLocaleString() || '0'}
            subtitle={`${dashboardData?.activeUsers?.toLocaleString() || '0'} Active`}
            color="from-blue-500 to-cyan-500"
            trend={dashboardData?.monthlyGrowth?.users || '+0%'}
            delay={0}
          />
          <AdminStatsCard 
            icon={Building}
            title="Properties"
            value={dashboardData?.totalProperties?.toLocaleString() || '0'}
            subtitle="Listed Properties"
            color="from-green-500 to-emerald-500"
            trend={dashboardData?.monthlyGrowth?.properties || '+0%'}
            delay={100}
          />
          <AdminStatsCard 
            icon={Clock}
            title="Pending Reviews" 
            value={dashboardData?.pendingReviews?.toString() || '0'}
            subtitle="Awaiting Approval"
            color="from-yellow-500 to-orange-500"
            trend="+5"
            delay={200}
          />
          <AdminStatsCard 
            icon={DollarSign}
            title="Total Value"
            value={dashboardData?.totalValue || '$0'}
            subtitle={`${dashboardData?.totalTransactions?.toLocaleString() || '0'} Transactions`}
            color="from-purple-500 to-pink-500"
            trend={dashboardData?.monthlyGrowth?.transactions || '+0%'}
            delay={300}
          />
        </div>

        {/* Real-time Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FuturisticCard hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Real-time Activity
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live Updates
                </div>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {dashboardData?.recentActivity?.map((activity: any, index: number) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'property_approved' ? 'bg-green-500/20' :
                      activity.type === 'user_registered' ? 'bg-blue-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {activity.type === 'property_approved' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                       activity.type === 'user_registered' ? <Users className="w-4 h-4 text-blue-400" /> :
                       <Bell className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-400">
                        by {activity.user} • {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Loading activity feed...</p>
                  </div>
                )}
              </div>
            </div>
          </FuturisticCard>

          <FuturisticCard hover={false}>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Performance Trends
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">User Growth</span>
                    <span className="text-sm text-green-400">{dashboardData?.monthlyGrowth?.users || '+0%'}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">Property Listings</span>
                    <span className="text-sm text-green-400">{dashboardData?.monthlyGrowth?.properties || '+0%'}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">Transaction Volume</span>
                    <span className="text-sm text-green-400">{dashboardData?.monthlyGrowth?.transactions || '+0%'}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </FuturisticCard>
        </div>

        {/* Property Review Queue */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Queue */}
          <div className="lg:col-span-2 space-y-6">
            <FuturisticCard hover={false}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Property Review Queue
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Search className="w-4 h-4 text-gray-300" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Filter className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        AI Score
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, title: 'Luxury Apartment Complex', status: 'pending', aiScore: 92, submittedBy: 'John Doe' },
                      { id: 2, title: 'Commercial Office Tower', status: 'ai_analysis', aiScore: 87, submittedBy: 'Jane Smith' },
                      { id: 3, title: 'Retail Shopping Center', status: 'under_review', aiScore: 95, submittedBy: 'Bob Johnson' },
                      { id: 4, title: 'Industrial Warehouse', status: 'pending', aiScore: 78, submittedBy: 'Alice Brown' }
                    ].map((property, index) => (
                      <tr key={property.id} className="group hover:bg-white/5 transition-all duration-500 border-b border-white/5 hover:border-white/10">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-100 group-hover:text-cyan-300 transition-colors">
                              {property.title}
                            </div>
                            <div className="text-xs text-gray-400">by {property.submittedBy}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={property.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                                style={{ width: `${property.aiScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-100">{property.aiScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => window.location.href = '/admin/properties/review'}
                              className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors" 
                              title="Review"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handlePropertyAction(property.id.toString(), 'approved', property.title)}
                              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors" 
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handlePropertyAction(property.id.toString(), 'rejected', property.title)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" 
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FuturisticCard>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00d4ff, #8b5cf6);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
