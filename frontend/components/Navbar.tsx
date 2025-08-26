'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Home, Building, User, FileText, Shield } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if admin is logged in by checking localStorage
    const adminSession = localStorage.getItem('propchain_admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        const now = new Date().getTime();
        if (session.expiresAt > now) {
          setShowAdminLink(true);
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
      }
    }
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">PropChain</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                href="/marketplace"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Building className="h-4 w-4" />
                <span>Marketplace</span>
              </Link>
              
              {isConnected && (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              
              {showAdminLink && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-1 text-purple-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium border border-purple-200 bg-purple-50"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
