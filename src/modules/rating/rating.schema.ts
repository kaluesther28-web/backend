import { z } from "zod";

const ALLOWED_TAGS = [
  "Fast arrival",
  "Professional",
  "Fair price",
  "Good tools",
  "Friendly",
  "Clean work",
  "Would recommend",
];

export class RatingSchemas {
  static create = z
    .object({
      requestId: z
        .string({ required_error: "Request ID is required" })
        .min(1),
      providerId: z
        .string({ required_error: "Provider ID is required" })
        .min(1),
      rating: z
        .number({ required_error: "Rating is required" })
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
      tags: z
        .array(z.string())
        .refine(
          (tags) => tags.every((tag) => ALLOWED_TAGS.includes(tag)),
          { message: `Tags must be one of: ${ALLOWED_TAGS.join(", ")}` }
        )
        .optional()
        .default([]),
      comment: z.string().max(300).optional().default(""),
    })
    .strict();
}
