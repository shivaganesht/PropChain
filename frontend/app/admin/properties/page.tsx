'use client';

import Link from 'next/link';
import { Building, Eye, FileText, BarChart3, PlusCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

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

export default function PropertiesOverviewPage() {
  const quickStats = [
    {
      title: 'Total Properties',
      value: '1,247',
      change: '+156',
      trend: 'up',
      icon: Building,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Pending Review',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Approved',
      value: '1,198',
      change: '+142',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Rejected',
      value: '26',
      change: '+9',
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500'
    }
  ];

  const quickActions = [
    {
      title: 'Review Queue',
      description: 'Properties awaiting review and approval',
      href: '/admin/properties/review',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      count: '23 pending'
    },
    {
      title: 'All Properties',
      description: 'Manage and view all properties in the system',
      href: '/admin/properties/all',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      count: '1,247 total'
    },
    {
      title: 'Add New Property',
      description: 'Add a new property to the platform',
      href: '/admin/properties/add',
      icon: PlusCircle,
      color: 'from-purple-500 to-pink-500',
      count: 'Quick add'
    },
    {
      title: 'Property Analytics',
      description: 'View detailed analytics and insights',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      count: 'View trends'
    }
  ];

  const recentActivity = [
    { type: 'approval', property: 'Luxury Downtown Condo', user: 'Admin', time: '5 minutes ago' },
    { type: 'submission', property: 'Suburban Family Home', user: 'John Doe', time: '12 minutes ago' },
    { type: 'rejection', property: 'Old Industrial Building', user: 'Admin', time: '1 hour ago' },
    { type: 'review', property: 'Commercial Office Space', user: 'Admin', time: '2 hours ago' },
    { type: 'approval', property: 'Modern Apartment Complex', user: 'Admin', time: '3 hours ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'submission': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'rejection': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'review': return <Eye className="w-4 h-4 text-yellow-400" />;
      default: return <Building className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'approval': return 'border-l-green-500';
      case 'submission': return 'border-l-blue-500';
      case 'rejection': return 'border-l-red-500';
      case 'review': return 'border-l-yellow-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Property Management
          </h1>
          <p className="text-gray-400 mt-2">Manage, review, and analyze all properties in the PropChain platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <FuturisticCard key={index} className="overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-green-400 flex items-center gap-1">
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-100">{stat.title}</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </FuturisticCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <FuturisticCard className="h-full group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-100 group-hover:text-white transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                      {action.description}
                    </p>
                    <p className="text-cyan-400 text-xs mt-2 font-medium">
                      {action.count}
                    </p>
                  </div>
                </div>
              </FuturisticCard>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FuturisticCard>
            <div className="h-full">
              <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg bg-gray-800/30 border-l-4 ${getActivityColor(activity.type)} hover:bg-gray-800/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 truncate">
                          {activity.property}
                        </p>
                        <p className="text-xs text-gray-400">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} by {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FuturisticCard>

          <FuturisticCard>
            <div className="h-full">
              <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Property Distribution
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">Residential</span>
                    <span className="text-sm text-blue-400">68%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">848 properties</span>
                </div>

                <div className="p-4 rounded-lg bg-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">Commercial</span>
                    <span className="text-sm text-green-400">22%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">274 properties</span>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">Industrial</span>
                    <span className="text-sm text-purple-400">7%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">87 properties</span>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-100">Mixed Use</span>
                    <span className="text-sm text-orange-400">3%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">38 properties</span>
                </div>
              </div>
            </div>
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
}
