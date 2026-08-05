import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['residential', 'commercial', 'land'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      latitude: Number,
      longitude: Number,
    },
    area: {
      size: Number,
      unit: {
        type: String,
        enum: ['sqft', 'sqm'],
        default: 'sqft',
      },
    },
    specifications: {
      bedrooms: Number,
      bathrooms: Number,
      kitchens: Number,
      parkingSpaces: Number,
      age: String,
    },
    amenities: [String],
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    views: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Property = mongoose.model('Property', propertySchema);
