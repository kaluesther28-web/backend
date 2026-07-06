import type { ObjectId } from "mongoose";
import { ApiError, ApiSuccess } from "../../utils/responseHandler.js";
import Rating from "./rating.model.js";
import Request from "../request/request.model.js";
import Provider from "../provider/provider.model.js";
import type { CreateRatingDTO } from "./rating.interface.js";

export class RatingService {
  // USER: Submit a rating after a completed job
  static async createRating(
    userId: ObjectId | string,
    data: CreateRatingDTO
  ) {
    const { requestId, providerId, rating, tags, comment } = data;

    // Verify request exists and belongs to this user
    const request = await Request.findOne({ _id: requestId, userId });
    if (!request) {
      throw ApiError.notFound("Request not found");
    }

    // Can only rate a completed job
    if (request.status !== "completed") {
      throw ApiError.badRequest(
        "You can only rate a completed job"
      );
    }

    // Check not already rated
    const existingRating = await Rating.findOne({ requestId });
    if (existingRating) {
      throw ApiError.badRequest("You have already rated this job");
    }

    // Create the rating
    const newRating = await Rating.create({
      requestId,
      userId,
      providerId,
      rating,
      tags:    tags ?? [],
      comment: comment ?? "",
    });

    // Recalculate provider's average rating
    const allRatings = await Rating.find({ providerId });
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(avgRating * 10) / 10, // round to 1 decimal
    });

    return ApiSuccess.created("Rating submitted successfully", {
      rating: newRating,
    });
  }

  // Get all ratings for a provider
  static async getProviderRatings(providerId: string) {
    const ratings = await Rating.find({ providerId })
      .populate("userId",    "firstName lastName")
      .populate("requestId", "serviceType createdAt")
      .sort({ createdAt: -1 });

    const provider = await Provider.findById(providerId).select(
      "businessName rating totalJobs"
    );

    if (!provider) {
      throw ApiError.notFound("Provider not found");
    }

    // Tag frequency breakdown
    const tagFrequency: Record<string, number> = {};
    ratings.forEach((r) => {
      r.tags.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] ?? 0) + 1;
      });
    });

    return ApiSuccess.ok("Ratings retrieved successfully", {
      provider,
      ratings,
      count:        ratings.length,
      tagFrequency,
    });
  }

  // Get a single rating for a request
  static async getRatingByRequest(requestId: string) {
    const rating = await Rating.findOne({ requestId })
      .populate("userId",     "firstName lastName")
      .populate("providerId", "businessName serviceType");

    if (!rating) {
      throw ApiError.notFound("No rating found for this request");
    }

    return ApiSuccess.ok("Rating retrieved successfully", { rating });
  }
}
