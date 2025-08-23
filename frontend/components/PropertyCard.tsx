'use client';

import Link from 'next/link';
import { MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    description: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    size: {
      value: number;
      unit: string;
    };
    totalTokens: number;
    availableTokens: number;
    pricePerTokenUSD: number;
    propertyType: string;
    images: any[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const soldPercentage = ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100;
  const totalValue = property.totalTokens * property.pricePerTokenUSD;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Property Image */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
          {property.propertyType}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location.city}, {property.location.state}</span>
        </div>

        {/* Size and Tokens */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Size</p>
            <p className="font-semibold">{property.size.value} {property.size.unit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Tokens</p>
            <p className="font-semibold">{property.totalTokens}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Price per Token</p>
          <p className="text-2xl font-bold text-blue-600">${property.pricePerTokenUSD}</p>
          <p className="text-xs text-gray-500">Total Value: ${totalValue.toLocaleString()}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Tokens Sold</span>
            <span className="font-semibold">{soldPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {property.availableTokens} of {property.totalTokens} available
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/property/${property._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </Link>
          <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">
            Buy Tokens
          </button>
        </div>
      </div>
    </div>
  );
}
