
import { ApiError, ApiSuccess } from "../../utils/responseHandler.js";
import Request from "./request.model.js";
import Provider from "../provider/provider.model.js";
import type {
  CancelRequestDTO,
  CompleteRequestDTO,
  CreateRequestDTO,
} from "./request.interface.js";

const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export class RequestService {
  // USER: Create a new service request
  static async createRequest(userId: any | string, data: CreateRequestDTO) {
    const { serviceType, description, longitude, latitude, address } = data;

    const activeRequest = await Request.findOne({
      userId,
      status: { $in: ["pending", "accepted", "en_route", "arrived"] },
    });

    if (activeRequest) {
      throw ApiError.badRequest(
        "You already have an active request. Please wait for it to complete or cancel it."
      );
    }

    const request = await Request.create({
      userId,
      serviceType,
      description,
      location: {
        type:        "Point",
        coordinates: [longitude, latitude],
        address,
      },
      code:   generateCode(),
      status: "pending",
      timeline: { requestedAt: new Date() },
    });

    return ApiSuccess.created("Request created successfully", { request });
  }

  // USER / PROVIDER: Get a single request by ID
  static async getRequestById(requestId: string, userId: any | string) {
    const request = await Request.findById(requestId)
      .populate("userId",     "firstName lastName phoneNumber")
      .populate("providerId", "businessName serviceType rating location");

    if (!request) throw ApiError.notFound("Request not found");

    const isOwner    = request.userId._id.toString() === userId.toString();
    const isProvider = request.providerId &&
      (request.providerId as any)._id?.toString() === userId.toString();

    if (!isOwner && !isProvider) {
      throw ApiError.forbidden("You do not have access to this request");
    }

    return ApiSuccess.ok("Request retrieved successfully", { request });
  }

  // USER: Get all their requests
  static async getUserRequests(userId: any | string) {
    const requests = await Request.find({ userId })
      .populate("providerId", "businessName serviceType rating")
      .sort({ createdAt: -1 });

    return ApiSuccess.ok("Requests retrieved successfully", {
      requests,
      count: requests.length,
    });
  }

  // PROVIDER: Get all requests assigned to them
  static async getProviderRequests(providerUserId: any | string) {
    const provider = await Provider.findOne({ userId: providerUserId });
    if (!provider) throw ApiError.notFound("Provider profile not found");

    const requests = await Request.find({ providerId: provider._id })
      .populate("userId", "firstName lastName phoneNumber")
      .sort({ createdAt: -1 });

    return ApiSuccess.ok("Requests retrieved successfully", {
      requests,
      count: requests.length,
    });
  }

  // PROVIDER: Get all pending requests near their location (all service types)
  static async getNearbyRequests(providerUserId: any | string) {
    const provider = await Provider.findOne({ userId: providerUserId });
    if (!provider) throw ApiError.notFound("Provider profile not found");

    if (provider.status === "offline") {
      throw ApiError.badRequest("You must be online to see available requests");
    }

    if (provider.status === "busy") {
      throw ApiError.badRequest(
        "You have an active job. Complete it before viewing new requests."
      );
    }

    const [longitude, latitude] = provider.location.coordinates;

    const requests = await Request.find({
      status:     "pending",
      providerId: null,
      location: {
        $near: {
          $geometry: {
            type:        "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    })
      .populate("userId", "firstName lastName phoneNumber")
      .limit(20);

    return ApiSuccess.ok(`Found ${requests.length} available request(s) nearby`, {
      requests,
      count: requests.length,
    });
  }

  // PROVIDER: Accept a pending request
  static async acceptRequest(requestId: string, providerUserId: any | string) {
    const provider = await Provider.findOne({ userId: providerUserId });
    if (!provider) throw ApiError.notFound("Provider profile not found");

    const request = await Request.findById(requestId);
    if (!request) throw ApiError.notFound("Request not found");

    if (request.status !== "pending") {
      throw ApiError.badRequest(`Cannot accept a request with status: ${request.status}`);
    }

    request.providerId          = provider._id as any;
    request.status              = "accepted";
    request.timeline.acceptedAt = new Date();
    await request.save();

    await Provider.findByIdAndUpdate(provider._id, { status: "busy" });
    await request.populate("userId", "firstName lastName phoneNumber");

    return ApiSuccess.ok("Request accepted successfully", { request });
  }

  // PROVIDER: Decline a pending request
  static async declineRequest(requestId: string, providerUserId: any | string) {
    const request = await Request.findById(requestId);
    if (!request) throw ApiError.notFound("Request not found");

    if (request.status !== "pending") {
      throw ApiError.badRequest(`Cannot decline a request with status: ${request.status}`);
    }

    request.status     = "declined";
    request.providerId = null;
    await request.save();

    return ApiSuccess.ok("Request declined", { request });
  }

  // PROVIDER: Mark as en route
  static async markEnRoute(requestId: string, providerUserId: any | string) {
    const provider = await Provider.findOne({ userId: providerUserId });
    if (!provider) throw ApiError.notFound("Provider profile not found");

    const request = await Request.findOne({ _id: requestId, providerId: provider._id });
    if (!request) throw ApiError.notFound("Request not found");

    if (request.status !== "accepted") {
      throw ApiError.badRequest(`Cannot mark en route — current status is: ${request.status}`);
    }

    request.status             = "en_route";
    request.timeline.enRouteAt = new Date();
    await request.save();

    return ApiSuccess.ok("Status updated — you are on the way", { request });
  }

  // PROVIDER: Mark as arrived
  static async markArrived(requestId: string, providerUserId: any | string) {
    const provider = await Provider.findOne({ userId: providerUserId });
    if (!provider) throw ApiError.notFound("Provider profile not found");

    const request = await Request.findOne({ _id: requestId, providerId: provider._id });
    if (!request) throw ApiError.notFound("Request not found");

    if (request.status !== "en_route") {
      throw ApiError.badRequest(`Cannot mark arrived — current status is: ${request.status}`);
    }

    request.status             = "arrived";
    request.timeline.arrivedAt = new Date();
    await request.save();

    return ApiSuccess.ok("You have arrived at the customer location", { request });
  }

  // PROVIDER: Mark job as completed
  static async completeRequest(
    requestId: string,
    providerUserId: any | string,
    data: CompleteRequestDTO
  ) {
    const provider = await Provider.findOne({ userId: providerUserId });
    if (!provider) throw ApiError.notFound("Provider profile not found");

    const request = await Request.findOne({ _id: requestId, providerId: provider._id });
    if (!request) throw ApiError.notFound("Request not found");

    if (request.status !== "arrived") {
      throw ApiError.badRequest(`Cannot complete — current status is: ${request.status}`);
    }

    const goWellFee       = Math.round(data.finalCost * 0.1);
    const providerEarning = data.finalCost - goWellFee;

    request.status               = "completed";
    request.finalCost            = data.finalCost;
    request.timeline.completedAt = new Date();
    await request.save();

    await Provider.findByIdAndUpdate(provider._id, {
      $inc: { totalJobs: 1, "earnings.total": providerEarning },
      status: "online",
    });

    return ApiSuccess.ok("Job completed successfully", {
      request,
      summary: { finalCost: data.finalCost, goWellFee, providerEarning },
    });
  }

  // USER: Cancel a request
  static async cancelRequest(
    requestId: string,
    userId: any | string,
    data: CancelRequestDTO
  ) {
    const request = await Request.findOne({ _id: requestId, userId });
    if (!request) throw ApiError.notFound("Request not found");

    const cancellableStatuses = ["pending", "accepted", "en_route"];
    if (!cancellableStatuses.includes(request.status)) {
      throw ApiError.badRequest(`Cannot cancel a request with status: ${request.status}`);
    }

    request.status               = "cancelled";
    request.cancelReason         = data.cancelReason ?? null;
    request.timeline.cancelledAt = new Date();
    await request.save();

    if (request.providerId) {
      await Provider.findByIdAndUpdate(request.providerId, { status: "online" });
    }

    return ApiSuccess.ok("Request cancelled successfully", { request });
  }
}