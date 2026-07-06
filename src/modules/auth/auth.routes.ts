import express from "express";
import methodNotAllowed from "../../middleware/methodNotAllowed.js";
import { AuthController } from "./auth.controller.js";
import { isAuth } from "../../middleware/auth.js";
import { userSchema } from "../user/user.schema.js";
import { AuthSchemas } from "./auth.schema.js";
import { validateBody } from "../../middleware/validateSchema.js";

const router = express.Router();

// GET  /api/v1/auth/me
router
  .route("/me")
  .get(isAuth, AuthController.getUser)
  .all(methodNotAllowed);

// POST /api/v1/auth/register
router
  .route("/register")
  .post(validateBody(userSchema), AuthController.register)
  .all(methodNotAllowed);

// POST /api/v1/auth/login
router
  .route("/login")
  .post(validateBody(AuthSchemas.login), AuthController.login)
  .all(methodNotAllowed);

// POST /api/v1/auth/send-otp
router
  .route("/send-otp")
  .post(validateBody(AuthSchemas.sendOTP), AuthController.sendOTP)
  .all(methodNotAllowed);

// POST /api/v1/auth/verify-otp
router
  .route("/verify-otp")
  .post(validateBody(AuthSchemas.verifyOTP), AuthController.verifyOTP)
  .all(methodNotAllowed);

// POST /api/v1/auth/forgot-password
router
  .route("/forgot-password")
  .post(validateBody(AuthSchemas.forgotPassword), AuthController.forgotPassword)
  .all(methodNotAllowed);

// POST /api/v1/auth/reset-password
router
  .route("/reset-password")
  .post(validateBody(AuthSchemas.resetPassword), AuthController.resetPassword)
  .all(methodNotAllowed);

export default router;
