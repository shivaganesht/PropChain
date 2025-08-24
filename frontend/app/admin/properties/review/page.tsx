'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  FileText, 
  Bot, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Upload,
  Star,
  DollarSign,
  MapPin,
  Calendar,
  User,
  Building,
  Shield,
  Zap
} from 'lucide-react';

// Property Status Enum
enum PropertyStatus {
  DRAFT = "draft",
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  AI_ANALYSIS = "ai_analysis",
  APPROVED = "approved",
  REJECTED = "rejected",
  ACTIVE = "active",
  SUSPENDED = "suspended"
}

// Mock property data with AI analysis
const mockProperty = {
  id: "prop_001",
  title: "Luxury Apartment Complex",
  description: "Modern 50-unit apartment complex in downtown area",
  submittedBy: {
    name: "John Doe",
    email: "john@example.com",
    verified: true
  },
  location: "Downtown District, City Center",
  totalValue: 5000000,
  totalTokens: 5000,
  tokenPrice: 1000,
  monthlyRent: 45000,
  submittedAt: "2025-01-20T10:30:00Z",
  status: PropertyStatus.AI_ANALYSIS,
  documents: [
    { type: "Property Deed", url: "#", verified: true, aiScore: 95 },
    { type: "Valuation Report", url: "#", verified: true, aiScore: 89 },
    { type: "Building Inspection", url: "#", verified: false, aiScore: 72 },
    { type: "Legal Certificate", url: "#", verified: true, aiScore: 98 }
  ],
  aiAnalysis: {
    overallScore: 89,
    authenticityScore: 94,
    valuationAccuracy: 87,
    riskAssessment: 82,
    complianceScore: 91,
    marketAnalysis: 85,
    recommendation: "APPROVE_WITH_CONDITIONS",
    risks: [
      { level: "LOW", description: "Property age may require maintenance reserves" },
      { level: "MEDIUM", description: "Market saturation in downtown area" }
    ],
    strengths: [
      "Prime location with high foot traffic",
      "Recent renovations increase property value",
      "Strong rental demand in area",
      "All legal documents verified"
    ],
    conditions: [
      "Require additional building inspection for HVAC systems",
      "Set aside 5% for maintenance reserves",
      "Implement rent control compliance measures"
    ]
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

// AI Score Circle
const AIScoreCircle = ({ score, size = "large" }: { score: number; size?: "small" | "large" }) => {
  const radius = size === "large" ? 45 : 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className={`relative ${size === "large" ? "w-24 h-24" : "w-12 h-12"} flex items-center justify-center`}>
      <svg className={`${size === "large" ? "w-24 h-24" : "w-12 h-12"} transform -rotate-90`}>
        <circle
          cx={size === "large" ? "48" : "24"}
          cy={size === "large" ? "48" : "24"}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size === "large" ? "48" : "24"}
          cy={size === "large" ? "48" : "24"}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className={`absolute flex flex-col items-center justify-center text-center ${getScoreColor(score)}`}>
        <span className={`${size === "large" ? "text-xl" : "text-sm"} font-bold`}>{score}</span>
        {size === "large" && <span className="text-xs text-gray-400">AI Score</span>}
      </div>
    </div>
  );
};

// Risk Badge
const RiskBadge = ({ level }: { level: string }) => {
  const colors = {
    LOW: "bg-green-500/20 text-green-400 border-green-500/30",
    MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
    HIGH: "bg-red-500/20 text-red-400 border-red-500/30"
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[level as keyof typeof colors]}`}>
      {level}
    </span>
  );
};

// Document Verification Row
const DocumentRow = ({ doc }: { doc: any }) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
    <div className="flex items-center gap-3">
      <FileText className="w-5 h-5 text-cyan-400" />
      <div>
        <p className="font-medium text-gray-100">{doc.type}</p>
        <div className="flex items-center gap-2 mt-1">
          <AIScoreCircle score={doc.aiScore} size="small" />
          <span className="text-xs text-gray-400">AI Score: {doc.aiScore}%</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {doc.verified ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
      )}
      <button className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
        <Eye className="w-4 h-4" />
      </button>
      <button className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Main Property Review Component
export default function PropertyReview() {
  const [property] = useState(mockProperty);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject' | null>(null);

  const handleApproval = (type: 'approve' | 'reject') => {
    setApprovalType(type);
    setShowApprovalModal(true);
  };

  const confirmApproval = () => {
    // Handle approval/rejection logic here
    console.log(`Property ${approvalType}d:`, property.id);
    setShowApprovalModal(false);
    setApprovalType(null);
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
                Property Review
              </h1>
              <p className="text-gray-400">ID: {property.id}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleApproval('reject')}
              className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
            <button 
              onClick={() => handleApproval('approve')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 transition-all duration-300 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Approve
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Overview */}
            <FuturisticCard hover={false}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100 mb-2">{property.title}</h2>
                  <p className="text-gray-300 mb-4">{property.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">${property.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{property.totalTokens} tokens</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{new Date(property.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <AIScoreCircle score={property.aiAnalysis.overallScore} />
                  <p className="text-xs text-gray-400 mt-2">Overall Score</p>
                </div>
              </div>
              
              {/* Submitter Info */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Submitted By
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-100 flex items-center gap-2">
                      {property.submittedBy.name}
                      {property.submittedBy.verified && (
                        <Shield className="w-4 h-4 text-green-400" />
                      )}
                    </p>
                    <p className="text-sm text-gray-400">{property.submittedBy.email}</p>
                  </div>
                </div>
              </div>
            </FuturisticCard>

            {/* Document Verification */}
            <FuturisticCard hover={false}>
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Document Verification
              </h3>
              <div className="space-y-3">
                {property.documents.map((doc, index) => (
                  <DocumentRow key={index} doc={doc} />
                ))}
              </div>
            </FuturisticCard>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis Overview */}
            <FuturisticCard hover={false}>
              <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                AI Analysis
              </h3>
              
              <div className="space-y-4">
                {/* Score Breakdown */}
                <div className="space-y-3">
                  {[
                    { label: "Authenticity", score: property.aiAnalysis.authenticityScore },
                    { label: "Valuation", score: property.aiAnalysis.valuationAccuracy },
                    { label: "Risk Assessment", score: property.aiAnalysis.riskAssessment },
                    { label: "Compliance", score: property.aiAnalysis.complianceScore },
                    { label: "Market Analysis", score: property.aiAnalysis.marketAnalysis }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700/50 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-100 w-8">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-purple-300">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-gray-200">
                    {property.aiAnalysis.recommendation.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </FuturisticCard>

            {/* Risks & Strengths */}
            <FuturisticCard hover={false}>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Risk Analysis</h3>
              <div className="space-y-3">
                {property.aiAnalysis.risks.map((risk, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskBadge level={risk.level} />
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-sm text-gray-300">{risk.description}</p>
                  </div>
                ))}
              </div>
            </FuturisticCard>

            {/* Strengths */}
            <FuturisticCard hover={false}>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Strengths</h3>
              <div className="space-y-2">
                {property.aiAnalysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-green-400 mt-0.5" />
                    <p className="text-sm text-gray-300">{strength}</p>
                  </div>
                ))}
              </div>
            </FuturisticCard>
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowApprovalModal(false)}></div>
            <FuturisticCard className="relative w-full max-w-md" hover={false}>
              <h3 className="text-xl font-bold text-gray-100 mb-4">
                {approvalType === 'approve' ? 'Approve Property' : 'Reject Property'}
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to {approvalType} "{property.title}"?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmApproval}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    approvalType === 'approve' 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Confirm {approvalType === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </FuturisticCard>
          </div>
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
