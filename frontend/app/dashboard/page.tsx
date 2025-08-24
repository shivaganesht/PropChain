'use client';

import { useState, useEffect } from 'react';
import { Upload, Plus, DollarSign, TrendingUp, Building, Eye, Edit, Zap, Globe, Sparkles } from 'lucide-react';

// Mock wallet connection
const useAccount = () => ({
  address: '0x1234...5678',
  isConnected: true
});

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>
  </div>
);

// Futuristic Card Component
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

// Glowing Button Component
type GlowButtonVariant = 'primary' | 'glass' | 'outline';

const GlowButton = ({
  children,
  onClick,
  variant = "primary",
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: GlowButtonVariant;
  className?: string;
}) => {
  const variants: Record<GlowButtonVariant, string> = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600
      hover:from-cyan-400 hover:to-blue-500
      shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl
      text-gray-600
    `,
    glass: `
      backdrop-blur-md bg-white/10 border border-white/20
      hover:bg-white/20 hover:border-white/30
      text-gray-600 shadow-lg hover:shadow-white/10
    `,
    outline: `
      border-2 border-cyan-500/50 text-cyan-400
      hover:border-cyan-400 hover:text-cyan-300
      hover:bg-cyan-500/10 shadow-lg hover:shadow-cyan-500/20
    `
  };

  return (
    <button 
      onClick={onClick}
      className={`
        relative group overflow-hidden
        font-semibold px-6 py-3 rounded-xl
        transform hover:scale-105 transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </button>
  );
};

// Animated Stats Card
import type { LucideIcon } from 'lucide-react';

type StatsCardProps = {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  delay?: number;
};

const StatsCard = ({ icon: Icon, title, value, subtitle, color, delay = 0 }: StatsCardProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <FuturisticCard className={`transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} backdrop-blur-sm`}>
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <Sparkles className="h-4 w-4 text-cyan-400 opacity-60" />
      </div>
      <div className="space-y-2">
        <p className={`text-3xl font-bold bg-gradient-to-r ${color.replace('from-', 'from-').replace('to-', 'to-')} bg-clip-text text-transparent transition-all duration-700 ${animate ? 'scale-100' : 'scale-90'}`}>
          {value}
        </p>
        <p className="text-sm text-gray-600">{subtitle}</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} animate-pulse`}></div>
          <span className="text-xs text-gray-400">{title}</span>
        </div>
      </div>
    </FuturisticCard>
  );
};

// Futuristic Table Row
const TableRow = ({ 
  property, 
  index, 
  onView, 
  onEdit 
}: { 
  property: any; 
  index: number;
  onView: (property: any) => void;
  onEdit: (property: any) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <tr className={`
      group hover:bg-white/5 transition-all duration-500
      transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
      border-b border-white/5 hover:border-white/10
    `}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <Building className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-medium text-gray-600 group-hover:text-cyan-300 transition-colors">
              {property.title}
            </div>
            <div className="text-xs text-gray-400">ID: {property.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-grey-600 border border-green-500/30">
          {property.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{property.soldTokens}/{property.totalTokens}</span>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${(property.soldTokens / property.totalTokens) * 100}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-600">${property.revenue.toLocaleString()}</span>
          <span className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12.5%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button 
            onClick={() => onView(property)}
            className="p-2 rounded-lg bg-cyan-300/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors group/btn"
            title="View Property Details"
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => onEdit(property)}
            className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors group/btn"
            title="Edit Property"
          >
            <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// List Property Modal Component
const ListPropertyModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
    <FuturisticCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto" hover={false}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          List New Property
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Property Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-100 focus:border-cyan-100 focus:outline-none transition-colors"
              placeholder="Modern Office Complex"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Property Type</label>
            <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-600 focus:border-cyan-500 focus:outline-none transition-colors">
              <option>Commercial</option>
              <option>Residential</option>
              <option>Industrial</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-600 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
            placeholder="Describe your property..."
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Total Value ($)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-600 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="1000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Total Tokens</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-600 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Token Price ($)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-600 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="1000"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <GlowButton variant="outline" onClick={onClose}>
            Cancel
          </GlowButton>
          <GlowButton variant="primary" onClick={() => {}}>
            <Zap className="w-4 h-4" />
            List Property
          </GlowButton>
        </div>
      </div>
    </FuturisticCard>
  </div>
);

// Edit Property Modal Component
const EditPropertyModal = ({ property, onClose, onSave }: { 
  property: any; 
  onClose: () => void; 
  onSave: (updatedProperty: any) => void;
}) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    totalTokens: property?.totalTokens || 0,
    description: property?.description || '',
    monthlyRent: property?.monthlyRent || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...property, ...formData });
    onClose();
  };

  const handleSave = () => {
    onSave({ ...property, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>
      <FuturisticCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto" hover={false}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Edit Property
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">Property Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
              required
              placeholder="Enter Property Title"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Total Tokens</label>
              <input 
                type="number" 
                value={formData.totalTokens}
                onChange={(e) => setFormData({...formData, totalTokens: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                required
                placeholder="Enter Total Tokens"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent ($)</label>
              <input 
                type="number" 
                value={formData.monthlyRent}
                onChange={(e) => setFormData({...formData, monthlyRent: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                required
                placeholder="Enter Montly Rent..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              placeholder="Property description..."
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <GlowButton variant="outline" onClick={onClose}>
              Cancel
            </GlowButton>
            <GlowButton variant="primary" onClick={handleSave}>
              <Edit className="w-4 h-4" />
              Save Changes
            </GlowButton>
          </div>
        </form>
      </FuturisticCard>
    </div>
  );
};

// View Property Modal Component  
const ViewPropertyModal = ({ property, onClose }: { property: any; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>
    <FuturisticCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto" hover={false}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-100 to-blue-200 bg-clip-text text-transparent">
          Property Details
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Property Title</label>
              <p className="text-lg font-semibold text-gray-100">{property?.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                property?.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {property?.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Rent</label>
              <p className="text-lg font-semibold text-gray-100">${property?.monthlyRent?.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Total Revenue</label>
              <p className="text-lg font-semibold text-green-400">${property?.revenue?.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Token Progress</label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-200">Sold: {property?.soldTokens}</span>
                  <span className="text-gray-200">Total: {property?.totalTokens}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${(property?.soldTokens / property?.totalTokens) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-200">
                  {((property?.soldTokens / property?.totalTokens) * 100).toFixed(1)}% Complete
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-end">
            <GlowButton variant="outline" onClick={onClose}>
              Close
            </GlowButton>
          </div>
        </div>
      </div>
    </FuturisticCard>
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [showListModal, setShowListModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [userProperties, setUserProperties] = useState([
    {
      id: '1',
      title: 'Modern Office Complex',
      status: 'active',
      totalTokens: 1000,
      soldTokens: 750,
      revenue: 750000,
      monthlyRent: 25000
    },
    {
      id: '2', 
      title: 'Luxury Apartment Building',
      status: 'active',
      totalTokens: 2000,
      soldTokens: 1200,
      revenue: 1200000,
      monthlyRent: 40000
    },
    {
      id: '3',
      title: 'Retail Shopping Center', 
      status: 'pending',
      totalTokens: 1500,
      soldTokens: 0,
      revenue: 0,
      monthlyRent: 35000
    }
  ]);

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  const handleSaveProperty = (updatedProperty: any) => {
    setUserProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === updatedProperty.id ? updatedProperty : property
      )
    );
    setShowEditModal(false);
    setSelectedProperty(null);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <FuturisticCard className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Access the future of real estate investment</p>
          <GlowButton variant="primary" className="w-full" onClick={undefined}>
            <Zap className="w-5 h-5" />
            Connect Wallet
          </GlowButton>
        </FuturisticCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-600">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Manage your tokenized property portfolio</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Connected: {address}
            </div>
          </div>
          
          <GlowButton 
            variant="primary" 
            onClick={() => setShowListModal(true)}
            className="text-lg px-8 py-4 text-white"
          >
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300 text-white" />
            List New Property
          </GlowButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard 
            icon={Building}
            title="Properties"
            value={userProperties.length}
            subtitle="Active Listings"
            color="from-blue-300 to-cyan-400"
            delay={0}
          />
          <StatsCard 
            icon={DollarSign}
            title="Revenue" 
            value="$1.95M"
            subtitle="Total Earnings"
            color="from-green-300 to-emerald-400"
            delay={200}
          />
          <StatsCard 
            icon={TrendingUp}
            title="Tokens"
            value="1,950"
            subtitle="Successfully Sold"
            color="from-purple-300 to-pink-400"
            delay={400}
          />
          <StatsCard 
            icon={Upload}
            title="Pending"
            value="1"
            subtitle="Awaiting Approval"
            color="from-orange-400 to-yellow-300"
            delay={600}
          />
        </div>

        {/* Properties Table */}
        <FuturisticCard hover={false}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-600 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-200 to-purple-300 flex items-center justify-center">
                <Building className="w-4 h-4 text-gray-600" />
              </div>
              Your Properties
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              Real-time data
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Tokens Progress
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userProperties.map((property, index) => (
                  <TableRow 
                    key={property.id} 
                    property={property} 
                    index={index}
                    onView={handleViewProperty}
                    onEdit={handleEditProperty}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </FuturisticCard>

        {/* List Property Modal */}
        {showListModal && (
          <ListPropertyModal onClose={() => setShowListModal(false)} />
        )}

        {/* Edit Property Modal */}
        {showEditModal && selectedProperty && (
          <EditPropertyModal 
            property={selectedProperty}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProperty(null);
            }}
            onSave={handleSaveProperty}
          />
        )}

        {/* View Property Modal */}
        {showViewModal && selectedProperty && (
          <ViewPropertyModal 
            property={selectedProperty}
            onClose={() => {
              setShowViewModal(false);
              setSelectedProperty(null);
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