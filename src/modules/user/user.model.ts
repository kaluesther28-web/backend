import mongoose, { Schema } from "mongoose";
import type { IUser } from "./user.interface.js";

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type:     String,
      trim:     true,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type:     String,
      trim:     true,
      required: [true, "Please provide a last name"],
    },
    email: {
      type:      String,
      required:  [true, "Please provide an email address"],
      trim:      true,
      lowercase: true,
      unique:    true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type:     String,
      required: [true, "Please provide a phone number"],
      unique:   true,
      match: [
        /^(\+234|0)(7|8|9)(0|1)\d{8}$/,
        "Please provide a valid Nigerian phone number",
      ],
    },
    password: {
      type:      String,
      required:  [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select:    false,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    isVerified: {
      type:    Boolean,
      default: false,
    },
    roles: {
      type:    [String],
      enum:    ["user", "provider", "admin"],
      default: ["user"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
