import mongoose, { Schema } from "mongoose";
import type { IRating } from "./rating.interface.js";

const RatingSchema: Schema<IRating> = new Schema(
  {
    requestId: {
      type:     Schema.Types.ObjectId,
      ref:      "Request",
      required: true,
      unique:   true, // One rating per request
    },
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    providerId: {
      type:     Schema.Types.ObjectId,
      ref:      "Provider",
      required: true,
    },
    rating: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
    },
    tags: {
      type:    [String],
      default: [],
    },
    comment: {
      type:    String,
      trim:    true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

RatingSchema.index({ providerId: 1 });
RatingSchema.index({ userId:     1 });

export default mongoose.model<IRating>("Rating", RatingSchema);
