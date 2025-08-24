'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldX,
  Eye,
  Ban,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Building,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  Download
} from 'lucide-react';

// Mock user data
const mockUsers = [
  {
    id: 'user_001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15',
    status: 'active',
    verified: true,
    propertiesListed: 3,
    totalInvestment: 150000,
    lastActivity: '2 hours ago',
    riskLevel: 'low',
    avatar: null
  },
  {
    id: 'user_002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    joinDate: '2024-02-20',
    status: 'active',
    verified: true,
    propertiesListed: 1,
    totalInvestment: 75000,
    lastActivity: '1 day ago',
    riskLevel: 'low',
    avatar: null
  },
  {
    id: 'user_003',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2024-03-10',
    status: 'suspended',
    verified: false,
    propertiesListed: 0,
    totalInvestment: 0,
    lastActivity: '1 week ago',
    riskLevel: 'high',
    avatar: null
  },
  {
    id: 'user_004',
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 (555) 321-0987',
    joinDate: '2024-01-05',
    status: 'active',
    verified: true,
    propertiesListed: 5,
    totalInvestment: 250000,
    lastActivity: '30 minutes ago',
    riskLevel: 'low',
    avatar: null
  }
];

// Components
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>
  </div>
);

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

// Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Active' },
    suspended: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Suspended' },
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pending' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Risk Level Badge
const RiskBadge = ({ level }: { level: string }) => {
  const riskConfig = {
    low: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Low Risk' },
    medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Medium Risk' },
    high: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'High Risk' }
  };

  const config = riskConfig[level as keyof typeof riskConfig] || riskConfig.low;

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

// User Stats Cards
const UserStatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  color 
}: {
  icon: any;
  title: string;
  value: string | number;
  change?: string;
  color: string;
}) => (
  <FuturisticCard>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} backdrop-blur-sm`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      {change && (
        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </FuturisticCard>
);

// User Action Dropdown
const UserActionDropdown = ({ 
  user, 
  onView, 
  onVerify, 
  onSuspend, 
  onActivate 
}: { 
  user: any;
  onView: (user: any) => void;
  onVerify: (user: any) => void;
  onSuspend: (user: any) => void;
  onActivate: (user: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-300" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50">
          <div className="py-2">
            <button 
              onClick={() => { onView(user); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            {!user.verified && (
              <button 
                onClick={() => { onVerify(user); setIsOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Verify User
              </button>
            )}
            {user.status === 'active' ? (
              <button 
                onClick={() => { onSuspend(user); setIsOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Suspend User
              </button>
            ) : (
              <button 
                onClick={() => { onActivate(user); setIsOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Activate User
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// User Detail Modal
const UserDetailModal = ({ 
  user, 
  onClose 
}: { 
  user: any; 
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>
    <FuturisticCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto" hover={false}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          User Details
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* User Overview */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-100">{user.name}</h3>
              {user.verified ? (
                <ShieldCheck className="w-5 h-5 text-green-400" />
              ) : (
                <ShieldX className="w-5 h-5 text-red-400" />
              )}
              <StatusBadge status={user.status} />
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {user.phone}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">Properties Listed</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">{user.propertiesListed}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Total Investment</span>
            </div>
            <p className="text-2xl font-bold text-green-400">${user.totalInvestment.toLocaleString()}</p>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Risk Assessment</span>
            </div>
            <RiskBadge level={user.riskLevel} />
          </div>
          <div className="text-sm text-gray-400">
            <p>Last activity: {user.lastActivity}</p>
            <p>Account verification: {user.verified ? 'Completed' : 'Pending'}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Activity</h4>
          <div className="space-y-2 text-xs text-gray-400">
            <p>• Logged in {user.lastActivity}</p>
            <p>• Updated profile information</p>
            <p>• Listed new property "Modern Office Complex"</p>
            <p>• Completed KYC verification</p>
          </div>
        </div>
      </div>
    </FuturisticCard>
  </div>
);

// Main User Management Component
export default function UserManagement() {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleVerifyUser = (user: any) => {
    console.log('Verifying user:', user.id);
    // Implementation for user verification
  };

  const handleSuspendUser = (user: any) => {
    console.log('Suspending user:', user.id);
    // Implementation for user suspension
  };

  const handleActivateUser = (user: any) => {
    console.log('Activating user:', user.id);
    // Implementation for user activation
  };

  return (
    <div className="min-h-screen text-gray-100">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-400">Manage platform users and permissions</p>
            </div>
          </div>
          
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Users
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <UserStatsCard
            icon={Users}
            title="Total Users"
            value={users.length}
            change="+12%"
            color="from-blue-500 to-cyan-500"
          />
          <UserStatsCard
            icon={ShieldCheck}
            title="Verified Users"
            value={users.filter(u => u.verified).length}
            change="+8%"
            color="from-green-500 to-emerald-500"
          />
          <UserStatsCard
            icon={Ban}
            title="Suspended Users"
            value={users.filter(u => u.status === 'suspended').length}
            color="from-red-500 to-pink-500"
          />
          <UserStatsCard
            icon={Building}
            title="Active Investors"
            value={users.filter(u => u.propertiesListed > 0).length}
            change="+5%"
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Filters and Search */}
        <FuturisticCard hover={false}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-100 focus:border-cyan-500 focus:outline-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter className="w-4 h-4" />
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </FuturisticCard>

        {/* Users Table */}
        <FuturisticCard hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Investment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-all duration-500 border-b border-white/5 hover:border-white/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-100 group-hover:text-cyan-300 transition-colors">
                              {user.name}
                            </div>
                            {user.verified ? (
                              <ShieldCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <ShieldX className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-100 font-medium">
                      {user.propertiesListed}
                    </td>
                    <td className="px-6 py-4 text-gray-100 font-medium">
                      ${user.totalInvestment.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={user.riskLevel} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.lastActivity}
                    </td>
                    <td className="px-6 py-4">
                      <UserActionDropdown
                        user={user}
                        onView={handleViewUser}
                        onVerify={handleVerifyUser}
                        onSuspend={handleSuspendUser}
                        onActivate={handleActivateUser}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FuturisticCard>

        {/* User Detail Modal */}
        {showDetailModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
