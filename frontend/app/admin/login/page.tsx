'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  AlertTriangle,
  Loader2
} from 'lucide-react';

// Simple auth function without context for login page
const mockAdmins = [
  {
    id: 'admin_001',
    email: 'admin@propchain.com',
    password: 'admin123',
    name: 'Super Admin',
    role: 'super_admin' as const,
    permissions: ['*']
  },
  {
    id: 'admin_002', 
    email: 'moderator@propchain.com',
    password: 'mod123',
    name: 'Property Moderator',
    role: 'moderator' as const,
    permissions: ['properties.view', 'properties.approve', 'properties.reject', 'users.view']
  },
  {
    id: 'admin_003',
    email: 'analyst@propchain.com', 
    password: 'analyst123',
    name: 'Data Analyst',
    role: 'admin' as const,
    permissions: ['analytics.view', 'properties.view', 'users.view']
  }
];

const authenticateAdmin = (email: string, password: string) => {
  const admin = mockAdmins.find(a => a.email === email && a.password === password);
  if (admin) {
    const session = {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: new Date().toISOString()
      },
      expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem('propchain_admin_session', JSON.stringify(session));
    return true;
  }
  return false;
};

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
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`
    relative group
    backdrop-blur-md bg-white/5 border border-white/10
    rounded-2xl p-8 
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

// Demo Credentials Component
const DemoCredentials = () => (
  <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
    <div className="flex items-center gap-2 mb-3">
      <AlertTriangle className="w-4 h-4 text-yellow-400" />
      <span className="text-sm font-medium text-yellow-300">Demo Credentials</span>
    </div>
    <div className="space-y-2 text-xs text-gray-300">
      <div>
        <span className="font-medium text-yellow-400">Super Admin:</span> admin@propchain.com / admin123
      </div>
      <div>
        <span className="font-medium text-blue-400">Moderator:</span> moderator@propchain.com / mod123
      </div>
      <div>
        <span className="font-medium text-green-400">Analyst:</span> analyst@propchain.com / analyst123
      </div>
    </div>
  </div>
);

export default function AdminLogin() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = authenticateAdmin(formData.email, formData.password);
      
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="w-full max-w-md">
        <FuturisticCard>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-400">PropChain Management Access</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Enter your admin email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <DemoCredentials />

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-xs text-gray-300">
                <span className="font-medium text-blue-300">Security Notice:</span> Admin sessions expire after 24 hours. All admin activities are logged and monitored.
              </div>
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
