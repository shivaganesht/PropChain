'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import { Loader2 } from 'lucide-react';

// Simple auth check without context
const checkAdminAuth = (): { isAuthenticated: boolean; admin: any } => {
  if (typeof window === 'undefined') return { isAuthenticated: false, admin: null };
  
  try {
    const session = localStorage.getItem('propchain_admin_session');
    if (!session) return { isAuthenticated: false, admin: null };
    
    const parsedSession = JSON.parse(session);
    const now = new Date().getTime();
    
    if (parsedSession.expiresAt > now) {
      return { isAuthenticated: true, admin: parsedSession.admin };
    } else {
      localStorage.removeItem('propchain_admin_session');
      return { isAuthenticated: false, admin: null };
    }
  } catch (error) {
    return { isAuthenticated: false, admin: null };
  }
};

// Auth Guard Component
function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<{ isLoading: boolean; isAuthenticated: boolean; admin: any }>({ 
    isLoading: true, 
    isAuthenticated: false, 
    admin: null 
  });

  useEffect(() => {
    const auth = checkAdminAuth();
    setAuthState({ isLoading: false, ...auth });
    
    if (!auth.isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [router, pathname]);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    );
  }

  // Allow login page without authentication
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authState.isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      <main className="ml-64 transition-all duration-300">
        <div className="p-8">
          {/* Admin Header */}
          <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome back, {authState.admin?.name} ({authState.admin?.role})
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Operational</span>
              </div>
            </div>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      {children}
    </AdminAuthGuard>
  );
}
