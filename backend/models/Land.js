const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  blockchainId: {
    type: Number,
    unique: true,
    sparse: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  size: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm', 'acres', 'hectares'],
      default: 'sqft'
    }
  },
  totalTokens: {
    type: Number,
    required: true,
    min: 1
  },
  availableTokens: {
    type: Number,
    required: true
  },
  pricePerTokenUSD: {
    type: Number,
    required: true,
    min: 0
  },
  rentPerTokenPerMonth: {
    type: Number,
    default: 0
  },
  documents: [{
    name: String,
    ipfsHash: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  images: [{
    url: String,
    ipfsHash: String,
    caption: String
  }],
  amenities: [String],
  propertyType: {
    type: String,
    enum: ['residential', 'commercial', 'agricultural', 'industrial', 'mixed'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'cancelled'],
    default: 'draft'
  },
  tokenHolders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    walletAddress: String,
    tokenAmount: Number,
    ownershipPercentage: Number
  }],
  transactionHash: String,
  contractAddress: String,
  metadataHash: String,
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tokenizedAt: Date
});

// Update available tokens when needed
landSchema.methods.updateAvailableTokens = function(soldAmount) {
  this.availableTokens = Math.max(0, this.availableTokens - soldAmount);
  if (this.availableTokens === 0) {
    this.status = 'sold';
  }
  return this.save();
};

// Calculate total value
landSchema.virtual('totalValue').get(function() {
  return this.totalTokens * this.pricePerTokenUSD;
});

// Update timestamp on save
landSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Land', landSchema);
