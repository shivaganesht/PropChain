'use client';

import { useState, useEffect } from 'react';
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
  Download
} from 'lucide-react';

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
const QuickActions = () => (
  <FuturisticCard hover={false}>
    <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
      <Settings className="w-5 h-5 text-cyan-400" />
      Quick Actions
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Review Properties', icon: FileText, color: 'from-blue-500 to-cyan-500' },
        { label: 'AI Analysis', icon: Bot, color: 'from-purple-500 to-pink-500' },
        { label: 'User Management', icon: Users, color: 'from-green-500 to-emerald-500' },
        { label: 'Platform Settings', icon: Settings, color: 'from-orange-500 to-yellow-500' }
      ].map((action, index) => (
        <button
          key={index}
          className={`p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-20 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group`}
        >
          <action.icon className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-gray-100">{action.label}</p>
        </button>
      ))}
    </div>
  </FuturisticCard>
);

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
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">You need admin privileges to access this panel</p>
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
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Welcome back, {adminName}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-gray-100 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AdminStatsCard 
            icon={Building}
            title="Total Properties"
            value="147"
            subtitle="Properties Listed"
            color="from-blue-500 to-cyan-500"
            trend="+12%"
            delay={0}
          />
          <AdminStatsCard 
            icon={Clock}
            title="Pending Reviews" 
            value="23"
            subtitle="Awaiting Approval"
            color="from-yellow-500 to-orange-500"
            trend="+5"
            delay={200}
          />
          <AdminStatsCard 
            icon={Bot}
            title="AI Analysis"
            value="89%"
            subtitle="Automation Rate"
            color="from-purple-500 to-pink-500"
            trend="+3%"
            delay={400}
          />
          <AdminStatsCard 
            icon={Users}
            title="Active Users"
            value="1,247"
            subtitle="Platform Users"
            color="from-green-500 to-emerald-500"
            trend="+8%"
            delay={600}
          />
        </div>

        {/* Main Content Grid */}
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
                      <tr key={property.id} className={`group hover:bg-white/5 transition-all duration-500 transform ${index % 2 === 0 ? 'translate-x-0' : 'translate-x-1'} opacity-100 border-b border-white/5 hover:border-white/10`}>
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
                            <button className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors" title="Review">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Reject">
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

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
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
