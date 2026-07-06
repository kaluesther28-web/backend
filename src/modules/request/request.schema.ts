import { z } from "zod";

export class RequestSchemas {
  static create = z
    .object({
      serviceType: z.enum(["mechanic", "vulcanizer", "tow"], {
        required_error: "Service type is required",
      }),
      description: z.string().max(300).default(""),
      longitude: z
        .number({ required_error: "Longitude is required" })
        .min(-180)
        .max(180),
      latitude: z
        .number({ required_error: "Latitude is required" })
        .min(-90)
        .max(90),
      address: z
        .string({ required_error: "Address is required" })
        .min(3, "Address must be at least 3 characters"),
    })
    .strict();

  static complete = z
    .object({
      finalCost: z
        .number({ required_error: "Final cost is required" })
        .min(0, "Final cost cannot be negative"),
    })
    .strict();

  static cancel = z
    .object({
      cancelReason: z.string().max(200).optional(),
    })
    .strict();
}
