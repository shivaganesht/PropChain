'use client';

import { useState } from 'react';
import { Bot, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Zap, Target, Settings, Download, RefreshCw } from 'lucide-react';

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

export default function AIAnalysisPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    alert('AI metrics refreshed successfully!');
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Metric', 'Value', 'Status', 'Last Updated'],
      ['Accuracy Rate', '94.2%', 'Excellent', new Date().toISOString()],
      ['Properties Analyzed', '1,247', 'Active', new Date().toISOString()],
      ['Risk Detection Rate', '97.8%', 'Excellent', new Date().toISOString()],
      ['Average Processing Time', '2.3s', 'Good', new Date().toISOString()],
      ['False Positives', '2.1%', 'Low', new Date().toISOString()],
      ['Model Confidence', '96.5%', 'High', new Date().toISOString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analysis-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const aiMetrics = [
    {
      title: 'Model Accuracy',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      description: 'Overall prediction accuracy'
    },
    {
      title: 'Properties Analyzed',
      value: '1,247',
      change: '+156',
      trend: 'up',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      description: 'Total properties processed'
    },
    {
      title: 'Risk Detection Rate',
      value: '97.8%',
      change: '+0.5%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500',
      description: 'High-risk property identification'
    },
    {
      title: 'Processing Speed',
      value: '2.3s',
      change: '-0.2s',
      trend: 'down',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      description: 'Average analysis time'
    }
  ];

  const recentAnalyses = [
    {
      id: 1,
      property: 'Luxury Downtown Condo',
      confidence: 98,
      risk: 'Low',
      recommendation: 'Approve',
      timestamp: '2024-01-16 14:30',
      details: 'Excellent location score, strong market indicators'
    },
    {
      id: 2,
      property: 'Suburban Family Home',
      confidence: 92,
      risk: 'Low',
      recommendation: 'Approve',
      timestamp: '2024-01-16 14:25',
      details: 'Good neighborhood stability, fair pricing'
    },
    {
      id: 3,
      property: 'Industrial Warehouse',
      confidence: 85,
      risk: 'Medium',
      recommendation: 'Review',
      timestamp: '2024-01-16 14:20',
      details: 'Market volatility concerns, location factors'
    },
    {
      id: 4,
      property: 'Commercial Strip Mall',
      confidence: 76,
      risk: 'High',
      recommendation: 'Reject',
      timestamp: '2024-01-16 14:15',
      details: 'Declining area, oversupply issues'
    }
  ];

  const modelPerformance = [
    { category: 'Residential', accuracy: 96.2, volume: 680, trend: '+3.1%' },
    { category: 'Commercial', accuracy: 94.8, volume: 340, trend: '+1.8%' },
    { category: 'Industrial', accuracy: 91.5, volume: 145, trend: '+0.9%' },
    { category: 'Mixed Use', accuracy: 89.3, volume: 82, trend: '+2.3%' }
  ];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'approve': return 'text-green-400 bg-green-500/20';
      case 'review': return 'text-yellow-400 bg-yellow-500/20';
      case 'reject': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Analysis Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Monitor AI model performance and property analysis insights</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* AI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {aiMetrics.map((metric, index) => (
            <FuturisticCard key={index} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color} bg-opacity-20`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                    {metric.change}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-100">{metric.title}</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-400">{metric.description}</p>
                </div>
              </div>
            </FuturisticCard>
          ))}
        </div>

        {/* Performance by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FuturisticCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Model Performance by Category
              </h3>
              
              <div className="space-y-4">
                {modelPerformance.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-100">{category.category}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">{category.trend}</span>
                        <span className="text-gray-400">{category.volume} properties</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">Accuracy</span>
                          <span className="text-sm font-medium text-gray-100">{category.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${category.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FuturisticCard>

          <FuturisticCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                AI Model Health
              </h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-700"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${96.5 * 3.39} 339`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">96.5%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Overall Model Confidence</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-100">Model Status</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-100">Last Training</span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">2 days ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-100">Model Version</span>
                    </div>
                    <span className="text-sm font-medium text-purple-400">v2.1.4</span>
                  </div>
                </div>
              </div>
            </div>
          </FuturisticCard>
        </div>

        {/* Recent AI Analyses */}
        <FuturisticCard>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              Recent AI Property Analyses
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Property</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Confidence</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Risk Level</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Recommendation</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Timestamp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-100">{analysis.property}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-20">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${analysis.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-100">{analysis.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-medium ${getRiskColor(analysis.risk)}`}>
                          {analysis.risk}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(analysis.recommendation)}`}>
                          {analysis.recommendation}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-400">{analysis.timestamp}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-400 max-w-xs truncate block">
                          {analysis.details}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FuturisticCard>
      </div>
    </div>
  );
}
