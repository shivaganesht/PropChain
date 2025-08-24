'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building, 
  DollarSign,
  Clock,
  Bot,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  PieChart,
  Activity
} from 'lucide-react';

// Mock analytics data
const analyticsData = {
  overview: {
    totalProperties: 147,
    totalUsers: 1247,
    totalRevenue: 2450000,
    approvalRate: 89,
    avgProcessingTime: 2.3
  },
  propertyStats: {
    byStatus: [
      { status: 'Active', count: 89, percentage: 60.5 },
      { status: 'Pending', count: 23, percentage: 15.6 },
      { status: 'Under Review', count: 18, percentage: 12.2 },
      { status: 'Rejected', count: 17, percentage: 11.6 }
    ],
    byType: [
      { type: 'Commercial', count: 67, revenue: 1200000 },
      { type: 'Residential', count: 52, revenue: 850000 },
      { type: 'Industrial', count: 28, revenue: 400000 }
    ],
    monthlySubmissions: [
      { month: 'Jan', submissions: 12, approvals: 10 },
      { month: 'Feb', submissions: 18, approvals: 16 },
      { month: 'Mar', submissions: 15, approvals: 13 },
      { month: 'Apr', submissions: 22, approvals: 19 },
      { month: 'May', submissions: 28, approvals: 25 },
      { month: 'Jun', submissions: 31, approvals: 28 }
    ]
  },
  aiMetrics: {
    totalAnalyses: 234,
    avgAccuracy: 94.2,
    processingTime: 1.8,
    flaggedIssues: 12,
    automationRate: 89
  },
  userMetrics: {
    activeUsers: 1247,
    newRegistrations: 156,
    retentionRate: 78,
    avgPropertiesPerUser: 2.3
  }
};

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

// Metric Card
const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  trend, 
  color 
}: {
  icon: any;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  color: string;
}) => (
  <FuturisticCard>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} backdrop-blur-sm`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </FuturisticCard>
);

// Chart Components
const BarChart = ({ data, title }: { data: any[]; title: string }) => (
  <FuturisticCard hover={false}>
    <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-cyan-400" />
      {title}
    </h3>
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{item.month}</span>
            <div className="flex gap-4">
              <span className="text-cyan-400">Submissions: {item.submissions}</span>
              <span className="text-green-400">Approvals: {item.approvals}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-700/50 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-cyan-500 transition-all duration-1000"
                style={{ width: `${(item.submissions / 35) * 100}%` }}
              ></div>
            </div>
            <div className="flex-1 bg-gray-700/50 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500 transition-all duration-1000"
                style={{ width: `${(item.approvals / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </FuturisticCard>
);

const PieChartCard = ({ data, title }: { data: any[]; title: string }) => (
  <FuturisticCard hover={false}>
    <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
      <PieChart className="w-5 h-5 text-purple-400" />
      {title}
    </h3>
    <div className="space-y-3">
      {data.map((item, index) => {
        const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500'];
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
              <span className="text-sm text-gray-300">{item.status}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-100">{item.count}</span>
              <span className="text-xs text-gray-400 ml-2">({item.percentage}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  </FuturisticCard>
);

// AI Performance Card
const AIPerformanceCard = () => (
  <FuturisticCard hover={false}>
    <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
      <Bot className="w-5 h-5 text-purple-400" />
      AI Performance Metrics
    </h3>
    <div className="space-y-4">
      {[
        { label: 'Analysis Accuracy', value: analyticsData.aiMetrics.avgAccuracy, unit: '%', color: 'from-green-500 to-emerald-500' },
        { label: 'Processing Speed', value: analyticsData.aiMetrics.processingTime, unit: 's', color: 'from-blue-500 to-cyan-500' },
        { label: 'Automation Rate', value: analyticsData.aiMetrics.automationRate, unit: '%', color: 'from-purple-500 to-pink-500' }
      ].map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{metric.label}</span>
            <span className="text-gray-100 font-medium">{metric.value}{metric.unit}</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000`}
              style={{ width: `${typeof metric.value === 'number' ? (metric.value > 10 ? (metric.value/100)*100 : (metric.value/10)*100) : 0}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-6 p-4 rounded-lg bg-purple-500/20 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-purple-300">Recent AI Activity</span>
      </div>
      <div className="space-y-1 text-xs text-gray-300">
        <p>• {analyticsData.aiMetrics.totalAnalyses} properties analyzed this month</p>
        <p>• {analyticsData.aiMetrics.flaggedIssues} potential issues flagged</p>
        <p>• Processing time reduced by 23% this quarter</p>
      </div>
    </div>
  </FuturisticCard>
);

// Main Analytics Component
export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

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
                Platform Analytics
              </h1>
              <p className="text-gray-400">Comprehensive platform insights and metrics</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-100 focus:border-cyan-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-100 hover:bg-white/20 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <MetricCard
            icon={Building}
            title="Total Properties"
            value={analyticsData.overview.totalProperties}
            change="+12%"
            trend="up"
            color="from-blue-500 to-cyan-500"
          />
          <MetricCard
            icon={Users}
            title="Active Users"
            value={analyticsData.overview.totalUsers}
            change="+8%"
            trend="up"
            color="from-green-500 to-emerald-500"
          />
          <MetricCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M`}
            change="+15%"
            trend="up"
            color="from-purple-500 to-pink-500"
          />
          <MetricCard
            icon={Clock}
            title="Avg Processing"
            value={`${analyticsData.overview.avgProcessingTime}d`}
            change="-0.3d"
            trend="up"
            color="from-orange-500 to-yellow-500"
          />
          <MetricCard
            icon={Bot}
            title="Approval Rate"
            value={`${analyticsData.overview.approvalRate}%`}
            change="+2%"
            trend="up"
            color="from-cyan-500 to-purple-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <BarChart 
            data={analyticsData.propertyStats.monthlySubmissions}
            title="Monthly Property Submissions"
          />
          <PieChartCard 
            data={analyticsData.propertyStats.byStatus}
            title="Properties by Status"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Types Revenue */}
          <FuturisticCard hover={false}>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              Revenue by Property Type
            </h3>
            <div className="space-y-4">
              {analyticsData.propertyStats.byType.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">{type.type}</span>
                    <span className="text-sm font-medium text-gray-100">
                      ${(type.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${(type.revenue / 1200000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{type.count} properties</span>
                  </div>
                </div>
              ))}
            </div>
          </FuturisticCard>

          {/* AI Performance */}
          <AIPerformanceCard />

          {/* User Engagement */}
          <FuturisticCard hover={false}>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              User Engagement
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">New Registrations</span>
                  <span className="text-lg font-bold text-green-400">{analyticsData.userMetrics.newRegistrations}</span>
                </div>
                <p className="text-xs text-gray-400">This month</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Retention Rate</span>
                  <span className="text-lg font-bold text-blue-400">{analyticsData.userMetrics.retentionRate}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${analyticsData.userMetrics.retentionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Avg Properties/User</span>
                  <span className="text-lg font-bold text-purple-400">{analyticsData.userMetrics.avgPropertiesPerUser}</span>
                </div>
                <p className="text-xs text-gray-400">Platform average</p>
              </div>
            </div>
          </FuturisticCard>
        </div>

        {/* Real-time Activity */}
        <FuturisticCard hover={false}>
          <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Real-time Platform Activity
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">23</div>
              <div className="text-sm text-gray-400">Properties under review</div>
              <div className="mt-2 w-2 h-2 bg-cyan-400 rounded-full mx-auto animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">8</div>
              <div className="text-sm text-gray-400">AI analyses in progress</div>
              <div className="mt-2 w-2 h-2 bg-green-400 rounded-full mx-auto animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">156</div>
              <div className="text-sm text-gray-400">Active user sessions</div>
              <div className="mt-2 w-2 h-2 bg-purple-400 rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </FuturisticCard>
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
