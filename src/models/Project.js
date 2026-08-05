import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    type: {
      type: String,
      enum: ['residential', 'commercial', 'mixed'],
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    location: {
      address: String,
      city: String,
      state: String,
      latitude: Number,
      longitude: Number,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalUnits: Number,
    availableUnits: Number,
    soldUnits: {
      type: Number,
      default: 0,
    },
    priceRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    amenities: [String],
    specifications: {
      plotArea: String,
      buildupArea: String,
      floors: Number,
    },
    launchDate: Date,
    completionDate: Date,
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
