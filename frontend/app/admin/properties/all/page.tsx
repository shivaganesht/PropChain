'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  MoreHorizontal,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const FuturisticCard = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`
    relative group
    backdrop-blur-md bg-white/5 border border-white/10
    rounded-2xl p-6 
    transition-all duration-500 ease-out
    shadow-xl
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

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  value: number;
  tokens: number;
  sold: number;
  status: 'active' | 'pending' | 'approved' | 'rejected' | 'sold';
  owner: string;
  listedDate: string;
  lastUpdate: string;
}

export default function AllProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Generate realistic property data
  useEffect(() => {
    const generateProperties = () => {
      const types = ['residential', 'commercial', 'luxury', 'agricultural', 'industrial'];
      const statuses: Array<Property['status']> = ['active', 'pending', 'approved', 'rejected', 'sold'];
      const locations = [
        'Denver, CO', 'Boulder, CO', 'Aspen, CO', 'Fort Collins, CO', 
        'Colorado Springs, CO', 'Vail, CO', 'Steamboat Springs, CO'
      ];

      const mockProperties: Property[] = Array.from({ length: 50 }, (_, i) => {
        // Use deterministic values based on index
        const deterministicRandom = (seed: number) => {
          return ((i + seed) % 100) / 100;
        };
        
        const tokens = Math.floor(deterministicRandom(1) * 5000) + 500;
        const sold = Math.floor(deterministicRandom(2) * tokens);
        const value = tokens * (Math.floor(deterministicRandom(3) * 200) + 50);
        
        const baseDate = new Date('2024-01-01');
        const listedDate = new Date(baseDate.getTime() + (i * 24 * 60 * 60 * 1000));
        const lastUpdate = new Date(listedDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        return {
          id: `prop_${i + 1}`,
          title: `Property ${i + 1}`,
          type: types[Math.floor(deterministicRandom(4) * types.length)],
          location: locations[Math.floor(deterministicRandom(5) * locations.length)],
          value,
          tokens,
          sold,
          status: statuses[Math.floor(deterministicRandom(6) * statuses.length)],
          owner: `User ${Math.floor(deterministicRandom(7) * 100) + 1}`,
          listedDate: listedDate.toISOString().split('T')[0],
          lastUpdate: lastUpdate.toISOString().split('T')[0]
        };
      });

      setProperties(mockProperties);
      setLoading(false);
    };

    generateProperties();
  }, []);

  // Filter and search properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesType = filterType === 'all' || property.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      case 'oldest':
        return new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime();
      case 'value_high':
        return b.value - a.value;
      case 'value_low':
        return a.value - b.value;
      case 'tokens_high':
        return b.tokens - a.tokens;
      case 'tokens_low':
        return a.tokens - b.tokens;
      default:
        return 0;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'sold': return <TrendingUp className="w-4 h-4 text-purple-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-300 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
      case 'approved': return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
      case 'rejected': return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'sold': return 'text-purple-300 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleExportReport = () => {
    const csvContent = [
      ['ID', 'Title', 'Type', 'Location', 'Value', 'Tokens', 'Sold', 'Status', 'Owner', 'Listed Date'],
      ...sortedProperties.map(p => [
        p.id, p.title, p.type, p.location, p.value, p.tokens, p.sold, p.status, p.owner, p.listedDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePropertyAction = (action: string, propertyId: string) => {
    console.log(`Action: ${action} on property: ${propertyId}`);
    // In real implementation, this would make API calls
    alert(`${action} action performed on property ${propertyId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-cyan-400" />
            All Properties
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive view of all properties on the platform
          </p>
        </div>
        
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters and Search */}
      <FuturisticCard>
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties, locations, or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="luxury">Luxury</option>
            <option value="agricultural">Agricultural</option>
            <option value="industrial">Industrial</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="value_high">Highest Value</option>
            <option value="value_low">Lowest Value</option>
            <option value="tokens_high">Most Tokens</option>
            <option value="tokens_low">Least Tokens</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-400 mb-4">
          Showing {sortedProperties.length} of {properties.length} properties
        </div>

        {/* Properties Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-400">Loading properties...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Property</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Tokens</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProperties.map((property) => (
                  <tr key={property.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-white">{property.title}</div>
                        <div className="text-sm text-gray-400">Listed: {property.listedDate}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-gray-300">{property.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-gray-300">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">${property.value.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{property.tokens}</div>
                      <div className="text-sm text-gray-400">{property.sold} sold</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${getStatusColor(property.status)}`}>
                        {getStatusIcon(property.status)}
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{property.owner}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePropertyAction('view', property.id)}
                          className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePropertyAction('edit', property.id)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePropertyAction('delete', property.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedProperties.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No properties found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </FuturisticCard>
    </div>
  );
}
