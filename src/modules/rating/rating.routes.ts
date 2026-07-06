import express from "express";
import methodNotAllowed from "../../middleware/methodNotAllowed.js";
import { RatingController } from "./rating.controller.js";
import { isAuth } from "../../middleware/auth.js";
import { RatingSchemas } from "./rating.schema.js";
import { validateBody } from "../../middleware/validateSchema.js";

const router = express.Router();

// POST /api/v1/ratings — user submits a rating
router
  .route("/")
  .post(isAuth, validateBody(RatingSchemas.create), RatingController.createRating)
  .all(methodNotAllowed);

// GET /api/v1/ratings/provider/:providerId — get all ratings for a provider
router
  .route("/provider/:providerId")
  .get(isAuth, RatingController.getProviderRatings)
  .all(methodNotAllowed);

// GET /api/v1/ratings/request/:requestId — get rating for a specific request
router
  .route("/request/:requestId")
  .get(isAuth, RatingController.getRatingByRequest)
  .all(methodNotAllowed);

export default router;
