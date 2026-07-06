import type { Document, ObjectId } from "mongoose";

export interface IRating extends Document {
  requestId:  ObjectId;
  userId:     ObjectId;
  providerId: ObjectId;
  rating:     number;
  tags:       string[];
  comment:    string;
  createdAt:  Date;
  updatedAt:  Date;
}

export interface CreateRatingDTO {
  requestId:  string;
  providerId: string;
  rating:     number;
  tags?:      string[];
  comment?:   string;
}
