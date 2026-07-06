import type { Document, ObjectId } from "mongoose";

export type ServiceType = "mechanic" | "vulcanizer" | "tow";

export type ProviderStatus = "offline" | "online" | "busy";

export interface IProvider extends Document {
  userId:       ObjectId;
  serviceType:  ServiceType;
  businessName: string;
  status:       ProviderStatus;
  isVerified:   boolean;
  isActive:     boolean;
  rating:       number;
  totalJobs:    number;
  location: {
    type:        string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  documents: {
    governmentId:  string | null;
    proofOfTrade:  string | null;
  };
  earnings: {
    total:   number;
    pending: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProviderDTO {
  userId:       ObjectId | string;
  serviceType:  ServiceType;
  businessName: string;
}

export interface UpdateProviderDTO {
  businessName?: string;
  serviceType?:  ServiceType;
}

export interface UpdateLocationDTO {
  longitude: number;
  latitude:  number;
}
