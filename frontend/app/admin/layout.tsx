'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Loader2 } from 'lucide-react';

// Auth Guard Component
function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { admin, isLoading, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
                  Welcome back, {admin?.name} ({admin?.role})
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
    <AdminAuthProvider>
      <AdminAuthGuard>
        {children}
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
}
