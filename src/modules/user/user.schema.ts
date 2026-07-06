import { z } from "zod";

export const userSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email address"),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .regex(
        /^(\+234|0)(7|8|9)(0|1)\d{8}$/,
        "Please provide a valid Nigerian phone number"
      ),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
  })
  .strict();

export const updateUserSchema = z
  .object({
    firstName:   z.string().min(2).optional(),
    lastName:    z.string().min(2).optional(),
    phoneNumber: z.string().regex(/^(\+234|0)(7|8|9)(0|1)\d{8}$/).optional(),
  })
  .strict();
