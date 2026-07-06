import mongoose, { Schema } from "mongoose";
import type { IProvider } from "./provider.interface.js";

const ProviderSchema: Schema<IProvider> = new Schema(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      unique:   true,
    },
    serviceType: {
      type:     String,
      enum:     ["mechanic", "vulcanizer", "tow"],
      required: [true, "Service type is required"],
    },
    businessName: {
      type:     String,
      trim:     true,
      required: [true, "Business name is required"],
    },
    status: {
      type:    String,
      enum:    ["offline", "online", "busy"],
      default: "offline",
    },
    isVerified: {
      type:    Boolean,
      default: false,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5,
    },
    totalJobs: {
      type:    Number,
      default: 0,
    },
    location: {
      type: {
        type:    String,
        enum:    ["Point"],
        default: "Point",
      },
      coordinates: {
        type:    [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    documents: {
      governmentId: { type: String, default: null },
      proofOfTrade: { type: String, default: null },
    },
    earnings: {
      total:   { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location-based queries
ProviderSchema.index({ location: "2dsphere" });
ProviderSchema.index({ serviceType: 1, status: 1 });

export default mongoose.model<IProvider>("Provider", ProviderSchema);
