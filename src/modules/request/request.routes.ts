

import express from "express";
import methodNotAllowed from "../../middleware/methodNotAllowed.js";
import { RequestController } from "./request.controller.js";
import { isAuth, isProvider } from "../../middleware/auth.js";
import { RequestSchemas } from "./request.schema.js";
import { validateBody } from "../../middleware/validateSchema.js";

const router = express.Router();

// POST /api/v1/requests
router
  .route("/")
  .post(isAuth, validateBody(RequestSchemas.create), RequestController.createRequest)
  .all(methodNotAllowed);

// GET /api/v1/requests/my-requests
router
  .route("/my-requests")
  .get(isAuth, RequestController.getMyRequests)
  .all(methodNotAllowed);

// GET /api/v1/requests/provider-requests
router
  .route("/provider-requests")
  .get(isProvider, RequestController.getProviderRequests)
  .all(methodNotAllowed);

// GET /api/v1/requests/available  ← NEW
router
  .route("/available")
  .get(isProvider, RequestController.getAvailableRequests)
  .all(methodNotAllowed);

// GET /api/v1/requests/:requestId
router
  .route("/:requestId")
  .get(isAuth, RequestController.getRequestById)
  .all(methodNotAllowed);

// PATCH /api/v1/requests/:requestId/accept
router
  .route("/:requestId/accept")
  .patch(isProvider, RequestController.acceptRequest)
  .all(methodNotAllowed);

// PATCH /api/v1/requests/:requestId/decline
router
  .route("/:requestId/decline")
  .patch(isProvider, RequestController.declineRequest)
  .all(methodNotAllowed);

// PATCH /api/v1/requests/:requestId/en-route
router
  .route("/:requestId/en-route")
  .patch(isProvider, RequestController.markEnRoute)
  .all(methodNotAllowed);

// PATCH /api/v1/requests/:requestId/arrived
router
  .route("/:requestId/arrived")
  .patch(isProvider, RequestController.markArrived)
  .all(methodNotAllowed);

// PATCH /api/v1/requests/:requestId/complete
router
  .route("/:requestId/complete")
  .patch(isProvider, validateBody(RequestSchemas.complete), RequestController.completeRequest)
  .all(methodNotAllowed);

// PATCH /api/v1/requests/:requestId/cancel
router
  .route("/:requestId/cancel")
  .patch(isAuth, validateBody(RequestSchemas.cancel), RequestController.cancelRequest)
  .all(methodNotAllowed);

export default router;