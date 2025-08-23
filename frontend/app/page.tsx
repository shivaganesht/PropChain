'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Coins, Shield, Users } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Fractional Real Estate
          <span className="text-blue-600"> Ownership</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Tokenize your land, enable fractional ownership, and unlock liquidity
          on the Avalanche blockchain with Chainlink integration.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/marketplace"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            Explore Properties <ArrowRight className="h-5 w-5" />
          </Link>
          {isConnected && (
            <Link
              href="/dashboard"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              List Your Property
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Building2 className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tokenized Properties</h3>
          <p className="text-gray-600">
            Convert real estate into ERC1155 tokens for easy fractional ownership
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Coins className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AVAX Payments</h3>
          <p className="text-gray-600">
            Buy property tokens with AVAX using real-time Chainlink price feeds
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Shield className="h-12 w-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
          <p className="text-gray-600">
            Smart contracts ensure secure transactions and transparent ownership
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Users className="h-12 w-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fair Distribution</h3>
          <p className="text-gray-600">
            Chainlink VRF ensures fair token allocation among competing buyers
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">List Property</h3>
            <p className="text-gray-600">
              Sellers upload property documents and set token quantity & price
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Buy Tokens</h3>
            <p className="text-gray-600">
              Buyers purchase fractional ownership tokens with AVAX
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn Returns</h3>
            <p className="text-gray-600">
              Token holders receive automated rent distributions monthly
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Real Estate Investment Journey
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join the future of property ownership on Avalanche
        </p>
        <Link
          href="/marketplace"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
        >
          Get Started <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
