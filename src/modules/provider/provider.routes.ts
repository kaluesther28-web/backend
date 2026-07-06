import express from "express";
import methodNotAllowed from "../../middleware/methodNotAllowed.js";
import { ProviderController } from "./provider.controller.js";
import { isAuth, isProvider } from "../../middleware/auth.js";
import { ProviderSchemas } from "./provider.schema.js";
import { validateBody, validateQuery } from "../../middleware/validateSchema.js";

const router = express.Router();

// GET  /api/v1/providers/nearby   — any logged-in user can find nearby providers
router
  .route("/nearby")
  .get(isAuth, validateQuery(ProviderSchemas.getNearby), ProviderController.getNearbyProviders)
  .all(methodNotAllowed);

// POST /api/v1/providers/register — logged-in user registers as a provider
router
  .route("/register")
  .post(isAuth, validateBody(ProviderSchemas.register), ProviderController.registerProvider)
  .all(methodNotAllowed);

// GET | PATCH /api/v1/providers/me
router
  .route("/me")
  .get(isProvider, ProviderController.getMyProfile)
  .patch(isProvider, validateBody(ProviderSchemas.updateProfile), ProviderController.updateProfile)
  .all(methodNotAllowed);

// PATCH /api/v1/providers/me/location
router
  .route("/me/location")
  .patch(isProvider, validateBody(ProviderSchemas.updateLocation), ProviderController.updateLocation)
  .all(methodNotAllowed);

// PATCH /api/v1/providers/me/status
router
  .route("/me/status")
  .patch(isProvider, validateBody(ProviderSchemas.updateStatus), ProviderController.updateStatus)
  .all(methodNotAllowed);

// GET /api/v1/providers/:providerId
router
  .route("/:providerId")
  .get(isAuth, ProviderController.getProviderById)
  .all(methodNotAllowed);

export default router;
