import type { Document, ObjectId } from "mongoose";
import type { ServiceType } from "../provider/provider.interface.js";

export type RequestStatus =
  | "pending"      // user created request, finding provider
  | "accepted"     // provider accepted
  | "en_route"     // provider on the way
  | "arrived"      // provider at location
  | "completed"    // job done
  | "cancelled"    // cancelled by user or provider
  | "declined";    // provider declined

export interface IRequest extends Document {
  userId:       ObjectId;
  providerId:   ObjectId | null;
  serviceType:  ServiceType;
  status:       RequestStatus;
  description:  string;
  location: {
    type:        string;
    coordinates: [number, number]; // [longitude, latitude]
    address:     string;
  };
  code:          string;         // 4-char verification code shown to user
  estimatedCost: number | null;
  finalCost:     number | null;
  cancelReason:  string | null;
  timeline: {
    requestedAt:  Date | null;
    acceptedAt:   Date | null;
    enRouteAt:    Date | null;
    arrivedAt:    Date | null;
    completedAt:  Date | null;
    cancelledAt:  Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestDTO {
  serviceType:  ServiceType;
  description:  string;
  longitude:    number;
  latitude:     number;
  address:      string;
}

export interface CompleteRequestDTO {
  finalCost: number;
}

export interface CancelRequestDTO {
  cancelReason?: string;
}
