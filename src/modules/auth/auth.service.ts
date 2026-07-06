import OTP from "../otp/otp.model.js";
import type {
  LoginDTO,
  OTPData,
  RegisterDTO,
  ResetPasswordDTO,
} from "./auth.interface.js";
import UserService from "../user/user.service.js";
import { comparePassword, hashPassword } from "../../utils/validationUtils.js";
import { ApiError, ApiSuccess } from "../../utils/responseHandler.js";
import { generateToken } from "../../config/token.js";
import { generateAndSaveOTP } from "../../utils/generateOTP.js";
import { mailService } from "../../services/mail.service.js";
import type { ObjectId } from "mongoose";

export class AuthService {
  // Register a user
  static async register(userData: RegisterDTO) {
    const { email } = userData;

    await UserService.checkIfUserExists(email);

    const user = await UserService.createUser(userData);

    const otp = await generateAndSaveOTP(email);
    // await mailService.sendOTPViaEmail(email, otp, user.firstName);

    user.password = undefined;

    return ApiSuccess.created(
      `Registration successful. An OTP has been sent to ${email}`,
      { user }
    );
  }

  // Login a user or provider
  static async login(userData: LoginDTO) {
    const { email, password } = userData;

    const user = await UserService.findUserByEmail(email);
    await comparePassword(password, user.password as string);

    if (!user.isVerified) {
      throw ApiError.forbidden(
        "Email not verified. Please verify your email to continue."
      );
    }

    if (!user.isActive) {
      throw ApiError.forbidden("Your account has been deactivated.");
    }

    const token = generateToken({ userId: user._id, roles: user.roles, email: user.email });

    user.password = undefined;

    return ApiSuccess.ok("Login successful", {
      user: {
        id:          user._id,
        firstName:   user.firstName,
        lastName:    user.lastName,
        email:       user.email,
        phoneNumber: user.phoneNumber,
        roles:       user.roles,
        isVerified:  user.isVerified,
      },
      token,
    });
  }

  // Get authenticated user profile
  static async getUser(userId: ObjectId) {
    const user = await UserService.findUserById(userId);
    user.password = undefined;
    return ApiSuccess.ok("User retrieved successfully", { user });
  }

  // Send OTP to email
  static async sendOTP({ email }: { email: string }) {
    const user = await UserService.findUserByEmail(email);

    if (user.isVerified) {
      return ApiSuccess.ok("This email is already verified");
    }

    const otp = await generateAndSaveOTP(email);
    await mailService.sendOTPViaEmail(email, otp, user.firstName);

    return ApiSuccess.ok(`OTP has been sent to ${email}`);
  }

  // Verify OTP and activate account
  static async verifyOTP({ email, otp }: OTPData) {
    const user = await UserService.findUserByEmail(email);

    if (user.isVerified) {
      return ApiSuccess.ok("This email is already verified");
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      throw ApiError.badRequest("Invalid or expired OTP");
    }

    user.isVerified = true;
    await user.save();

    await OTP.deleteMany({ email });

    return ApiSuccess.ok("Email verified successfully");
  }

  // Send OTP for password reset
  static async forgotPassword({ email }: { email: string }) {
    const user = await UserService.findUserByEmail(email);

    const otp = await generateAndSaveOTP(email);
    await mailService.sendOTPViaEmail(email, otp, user.firstName);

    return ApiSuccess.ok(`Password reset OTP has been sent to ${email}`);
  }

  // Reset password using OTP
  static async resetPassword({ email, otp, password }: ResetPasswordDTO) {
    const user = await UserService.findUserByEmail(email);

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      throw ApiError.badRequest("Invalid or expired OTP");
    }

    user.password = await hashPassword(password);
    await user.save();

    await OTP.deleteMany({ email });

    return ApiSuccess.ok("Password reset successfully");
  }
}
