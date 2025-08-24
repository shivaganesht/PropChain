'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  BarChart3, 
  Settings,
  Bot,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout, hasPermission } = useAdminAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    {
      label: 'Properties',
      href: '/admin/properties',
      icon: Building,
      description: 'Property management',
      subItems: [
        { label: 'Review Queue', href: '/admin/properties/review' },
        { label: 'All Properties', href: '/admin/properties/all' }
      ]
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'User management'
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Platform insights'
    },
    {
      label: 'AI Analysis',
      href: '/admin/ai',
      icon: Bot,
      description: 'AI performance'
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Platform config'
    }
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-md border-r border-white/10 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-400">PropChain Management</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive(item.href) ? 'text-cyan-400' : ''
              }`} />
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              )}
            </Link>
            
            {/* Sub-items */}
            {!isCollapsed && item.subItems && isActive(item.href) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block px-3 py-1 text-sm rounded transition-colors ${
                      pathname === subItem.href
                        ? 'text-cyan-300 bg-cyan-500/10'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Admin Info */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-100">{admin?.name}</div>
              <div className="text-xs text-gray-400">{admin?.email}</div>
              <div className="text-xs text-purple-300 capitalize">{admin?.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
