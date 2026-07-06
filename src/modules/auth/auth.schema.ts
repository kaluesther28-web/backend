import { z } from "zod";

export class AuthSchemas {
  static login = z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long"),
    })
    .strict();

  static sendOTP = z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address"),
    })
    .strict();

  static verifyOTP = z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address"),
      otp: z
        .string({ required_error: "OTP is required" })
        .length(6, "OTP must be 6 digits"),
    })
    .strict();

  static forgotPassword = z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address"),
    })
    .strict();

  static resetPassword = z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address"),
      otp: z
        .string({ required_error: "OTP is required" })
        .length(6, "OTP must be 6 digits"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long"),
    })
    .strict();
}
