'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Admin User Interface
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin?: string;
}

// Auth Context Interface
interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// Create Context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Mock admin users database
const mockAdmins = [
  {
    id: 'admin_001',
    email: 'admin@propchain.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Super Admin',
    role: 'super_admin' as const,
    permissions: ['*'] // All permissions
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
    permissions: ['analytics.view', 'users.view', 'properties.view']
  }
];

// Permission definitions
const PERMISSIONS = {
  // Properties
  PROPERTIES_VIEW: 'properties.view',
  PROPERTIES_APPROVE: 'properties.approve', 
  PROPERTIES_REJECT: 'properties.reject',
  PROPERTIES_DELETE: 'properties.delete',
  
  // Users
  USERS_VIEW: 'users.view',
  USERS_EDIT: 'users.edit',
  USERS_SUSPEND: 'users.suspend',
  USERS_DELETE: 'users.delete',
  
  // Analytics  
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',
  
  // System
  SYSTEM_SETTINGS: 'system.settings',
  SYSTEM_LOGS: 'system.logs'
};

// Auth Provider Component
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedAdmin = localStorage.getItem('propchain_admin');
      const sessionExpiry = localStorage.getItem('propchain_admin_expiry');
      
      if (savedAdmin && sessionExpiry) {
        const expiryTime = new Date(sessionExpiry).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime < expiryTime) {
          // Session is still valid
          try {
            const adminData = JSON.parse(savedAdmin);
            setAdmin(adminData);
          } catch (error) {
            console.error('Error parsing admin data:', error);
            logout();
          }
        } else {
          // Session expired
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find admin user
      const foundAdmin = mockAdmins.find(
        admin => admin.email === email && admin.password === password
      );
      
      if (foundAdmin) {
        const adminUser: AdminUser = {
          id: foundAdmin.id,
          email: foundAdmin.email,
          name: foundAdmin.name,
          role: foundAdmin.role,
          permissions: foundAdmin.permissions,
          lastLogin: new Date().toISOString()
        };
        
        // Save to localStorage with 24-hour expiry
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        
        localStorage.setItem('propchain_admin', JSON.stringify(adminUser));
        localStorage.setItem('propchain_admin_expiry', expiryTime.toISOString());
        
        setAdmin(adminUser);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('propchain_admin');
    localStorage.removeItem('propchain_admin_expiry');
    setAdmin(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    
    // Super admin has all permissions
    if (admin.permissions.includes('*')) return true;
    
    // Check specific permission
    return admin.permissions.includes(permission);
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Hook to use admin auth
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Export permissions for use in components
export { PERMISSIONS };
