'use client';

import { useState, useEffect } from 'react';
import { MapPin, Users, DollarSign, Home } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Property {
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
  status: string;
}

export default function Marketplace() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lands`, {
        params: {
          status: 'active',
          ...filter
        }
      });
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Use demo data if API fails
      setProperties(getDemoProperties());
    } finally {
      setLoading(false);
    }
  };

  const getDemoProperties = () => [
    {
      _id: '1',
      title: 'Downtown Commercial Building',
      description: 'Prime commercial property in city center',
      location: {
        city: 'Denver',
        state: 'Colorado',
        country: 'USA'
      },
      size: {
        value: 5000,
        unit: 'sqft'
      },
      totalTokens: 1000,
      availableTokens: 750,
      pricePerTokenUSD: 100,
      propertyType: 'commercial',
      images: [],
      status: 'active'
    },
    {
      _id: '2',
      title: 'Suburban Family Home',
      description: 'Beautiful 4-bedroom home in quiet neighborhood',
      location: {
        city: 'Boulder',
        state: 'Colorado',
        country: 'USA'
      },
      size: {
        value: 2500,
        unit: 'sqft'
      },
      totalTokens: 500,
      availableTokens: 300,
      pricePerTokenUSD: 200,
      propertyType: 'residential',
      images: [],
      status: 'active'
    },
    {
      _id: '3',
      title: 'Agricultural Land',
      description: 'Fertile farmland with water rights',
      location: {
        city: 'Fort Collins',
        state: 'Colorado',
        country: 'USA'
      },
      size: {
        value: 10,
        unit: 'acres'
      },
      totalTokens: 2000,
      availableTokens: 1500,
      pricePerTokenUSD: 50,
      propertyType: 'agricultural',
      images: [],
      status: 'active'
    }
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    fetchProperties();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Property Marketplace
        </h1>
        <p className="text-xl text-gray-600">
          Browse and invest in tokenized real estate properties
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Filter Properties</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <select
            name="propertyType"
            value={filter.propertyType}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="agricultural">Agricultural</option>
            <option value="industrial">Industrial</option>
          </select>
          
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filter.city}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price (USD)"
            value={filter.minPrice}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No properties found matching your criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold">{properties.length}</p>
            <p className="text-sm opacity-90">Active Properties</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              ${properties.reduce((sum, p) => sum + (p.totalTokens * p.pricePerTokenUSD), 0).toLocaleString()}
            </p>
            <p className="text-sm opacity-90">Total Value Locked</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {properties.reduce((sum, p) => sum + (p.totalTokens - p.availableTokens), 0)}
            </p>
            <p className="text-sm opacity-90">Tokens Sold</p>
          </div>
          <div>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm opacity-90">Active Investors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
