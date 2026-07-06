import mongoose, { Document, Schema } from "mongoose";

interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema: Schema<IOTP> = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Auto-deleted after 5 minutes
  },
});

const OTP = mongoose.model<IOTP>("OTP", otpSchema);

export default OTP;
