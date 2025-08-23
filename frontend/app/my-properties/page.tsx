'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, TrendingUp, DollarSign, Users, ChevronRight } from 'lucide-react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  location: string;
  totalTokens: number;
  ownedTokens: number;
  currentValue: number;
  monthlyIncome: number;
  image: string;
}

export default function MyPropertiesPage() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Simulate loading properties
    setTimeout(() => {
      setProperties([
        {
          id: '1',
          title: 'Luxury Villa in Goa',
          location: 'Calangute, Goa',
          totalTokens: 1000,
          ownedTokens: 150,
          currentValue: 15000,
          monthlyIncome: 450,
          image: '/property1.jpg'
        },
        {
          id: '2',
          title: 'Mumbai Office Space',
          location: 'Bandra, Mumbai',
          totalTokens: 2000,
          ownedTokens: 100,
          currentValue: 20000,
          monthlyIncome: 800,
          image: '/property2.jpg'
        },
        {
          id: '3',
          title: 'Bangalore Tech Park',
          location: 'Whitefield, Bangalore',
          totalTokens: 1500,
          ownedTokens: 75,
          currentValue: 11250,
          monthlyIncome: 375,
          image: '/property3.jpg'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center"
      >
        <Building className="h-24 w-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to view your properties</p>
      </motion.div>
    );
  }

  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalIncome = properties.reduce((sum, p) => sum + p.monthlyIncome, 0);
  const totalTokens = properties.reduce((sum, p) => sum + p.ownedTokens, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">My Properties</h1>
        <p className="text-gray-600 text-lg">Track your real estate investments</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold">{properties.length}</p>
          <p className="text-sm text-gray-600 mt-1">Properties Owned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Value</span>
          </div>
          <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Portfolio Value</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Income</span>
          </div>
          <p className="text-3xl font-bold">${totalIncome}</p>
          <p className="text-sm text-gray-600 mt-1">Monthly Income</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Tokens</span>
          </div>
          <p className="text-3xl font-bold">{totalTokens}</p>
          <p className="text-sm text-gray-600 mt-1">Total Tokens</p>
        </motion.div>
      </div>

      {/* Properties List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Your Investments</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">Start investing in fractional real estate</p>
            <Link href="/marketplace" className="btn-primary inline-block">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{property.location}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ownership</span>
                      <span className="font-semibold">
                        {((property.ownedTokens / property.totalTokens) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tokens</span>
                      <span className="font-semibold">
                        {property.ownedTokens}/{property.totalTokens}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Value</span>
                      <span className="font-semibold text-green-600">
                        ${property.currentValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Income</span>
                      <span className="font-semibold text-blue-600">
                        ${property.monthlyIncome}
                      </span>
                    </div>
                  </div>

                  <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                    View Details <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
