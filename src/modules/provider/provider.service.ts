import type { ObjectId } from "mongoose";
import { ApiError, ApiSuccess } from "../../utils/responseHandler.js";
import Provider from "./provider.model.js";
import User from "../user/user.model.js";
import type {
  CreateProviderDTO,
  UpdateLocationDTO,
  UpdateProviderDTO,
  ServiceType,
} from "./provider.interface.js";

export class ProviderService {
  // Register as a provider (user must already have a User account)
  static async registerProvider(userId: ObjectId | string, data: CreateProviderDTO) {
    const existingProvider = await Provider.findOne({ userId });
    if (existingProvider) {
      throw ApiError.badRequest("You are already registered as a provider");
    }

    const provider = new Provider({
      userId,
      serviceType:  data.serviceType,
      businessName: data.businessName,
    });

    await provider.save();

    // Add 'provider' role to user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { roles: "provider" },
    });

    return ApiSuccess.created("Provider profile created successfully", {
      provider,
    });
  }

  // Get provider profile by userId
  static async getProviderByUserId(userId: ObjectId | string) {
    const provider = await Provider.findOne({ userId }).populate(
      "userId",
      "firstName lastName email phoneNumber"
    );

    if (!provider) {
      throw ApiError.notFound("Provider profile not found");
    }

    return ApiSuccess.ok("Provider profile retrieved successfully", {
      provider,
    });
  }

  // Get provider profile by providerId
  static async getProviderById(providerId: string) {
    const provider = await Provider.findById(providerId).populate(
      "userId",
      "firstName lastName email phoneNumber"
    );

    if (!provider) {
      throw ApiError.notFound("Provider not found");
    }

    return ApiSuccess.ok("Provider retrieved successfully", { provider });
  }

  // Update provider profile
  static async updateProvider(
    userId: ObjectId | string,
    data: UpdateProviderDTO
  ) {
    const provider = await Provider.findOneAndUpdate(
      { userId },
      { ...data },
      { new: true, runValidators: true }
    );

    if (!provider) {
      throw ApiError.notFound("Provider profile not found");
    }

    return ApiSuccess.ok("Provider profile updated successfully", { provider });
  }

  // Update provider live location
  static async updateLocation(
    userId: ObjectId | string,
    { longitude, latitude }: UpdateLocationDTO
  ) {
    const provider = await Provider.findOneAndUpdate(
      { userId },
      {
        location: {
          type:        "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!provider) {
      throw ApiError.notFound("Provider profile not found");
    }

    return ApiSuccess.ok("Location updated successfully", {
      location: provider.location,
    });
  }

  // Toggle provider online/offline status
  static async updateStatus(
    userId: ObjectId | string,
    status: "offline" | "online" | "busy"
  ) {
    const provider = await Provider.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    );

    if (!provider) {
      throw ApiError.notFound("Provider profile not found");
    }

    return ApiSuccess.ok(`You are now ${status}`, {
      status: provider.status,
    });
  }

  // Find nearby available providers by service type and coordinates
  static async getNearbyProviders(
    longitude: number,
    latitude:  number,
    serviceType?: ServiceType,
    radiusInMeters: number = 5000
  ) {
    const query: any = {
      status: "online",
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type:        "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    if (serviceType) {
      query.serviceType = serviceType;
    }

    const providers = await Provider.find(query)
      .populate("userId", "firstName lastName phoneNumber")
      .limit(20);

    return ApiSuccess.ok(
      `Found ${providers.length} provider(s) nearby`,
      { providers, count: providers.length }
    );
  }
}
