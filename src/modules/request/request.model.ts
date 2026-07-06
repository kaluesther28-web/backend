import mongoose, { Schema } from "mongoose";
import type { IRequest } from "./request.interface.js";

const RequestSchema: Schema<IRequest> = new Schema(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    providerId: {
      type:    Schema.Types.ObjectId,
      ref:     "Provider",
      default: null,
    },
    serviceType: {
      type:     String,
      enum:     ["mechanic", "vulcanizer", "tow"],
      required: [true, "Service type is required"],
    },
    status: {
      type:    String,
      enum:    ["pending", "accepted", "en_route", "arrived", "completed", "cancelled", "declined"],
      default: "pending",
    },
    description: {
      type:    String,
      trim:    true,
      default: "",
    },
    location: {
      type: {
        type:    String,
        enum:    ["Point"],
        default: "Point",
      },
      coordinates: {
        type:     [Number],
        required: true,
      },
      address: {
        type:    String,
        trim:    true,
        default: "",
      },
    },
    code: {
      type:     String,
      required: true,
    },
    estimatedCost: {
      type:    Number,
      default: null,
    },
    finalCost: {
      type:    Number,
      default: null,
    },
    cancelReason: {
      type:    String,
      default: null,
    },
    timeline: {
      requestedAt:  { type: Date, default: null },
      acceptedAt:   { type: Date, default: null },
      enRouteAt:    { type: Date, default: null },
      arrivedAt:    { type: Date, default: null },
      completedAt:  { type: Date, default: null },
      cancelledAt:  { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location queries
RequestSchema.index({ location: "2dsphere" });
RequestSchema.index({ userId: 1, status: 1 });
RequestSchema.index({ providerId: 1, status: 1 });

export default mongoose.model<IRequest>("Request", RequestSchema);
