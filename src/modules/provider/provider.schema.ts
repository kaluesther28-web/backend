import { z } from "zod";

export class ProviderSchemas {
  static register = z
    .object({
      serviceType: z.enum(["mechanic", "vulcanizer", "tow"], {
        required_error: "Service type is required",
        invalid_type_error: "Service type must be mechanic, vulcanizer, or tow",
      }),
      businessName: z
        .string({ required_error: "Business name is required" })
        .min(2, "Business name must be at least 2 characters"),
    })
    .strict();

  static updateProfile = z
    .object({
      businessName: z.string().min(2).optional(),
      serviceType:  z.enum(["mechanic", "vulcanizer", "tow"]).optional(),
    })
    .strict();

  static updateLocation = z
    .object({
      longitude: z
        .number({ required_error: "Longitude is required" })
        .min(-180)
        .max(180),
      latitude: z
        .number({ required_error: "Latitude is required" })
        .min(-90)
        .max(90),
    })
    .strict();

  static updateStatus = z
    .object({
      status: z.enum(["offline", "online", "busy"], {
        required_error: "Status is required",
      }),
    })
    .strict();

  static getNearby = z
    .object({
      longitude:   z.coerce.number().min(-180).max(180),
      latitude:    z.coerce.number().min(-90).max(90),
      serviceType: z.enum(["mechanic", "vulcanizer", "tow"]).optional(),
      radius:      z.coerce.number().min(100).max(50000).default(5000),
    })
    .strict();
}
