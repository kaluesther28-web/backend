import type { ObjectId } from "mongoose";
import { ApiError } from "../../utils/responseHandler.js";
import { hashPassword } from "../../utils/validationUtils.js";
import type { RegisterDTO } from "../auth/auth.interface.js";
import type { IUser } from "./user.interface.js";
import User from "./user.model.js";

class UserService {
  static async createUser(userData: RegisterDTO): Promise<IUser> {
    const { firstName, lastName, email, phoneNumber, password } = userData;

    const hashedPassword = await hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      roles: ["user"],
      isVerified:true,
      
    });

    await user.save();
    return user;
  }

  static async findUserByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw ApiError.notFound("No user found with this email");
    }
    return user;
  }

  static async findUserById(userId: ObjectId | string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }

  static async checkIfUserExists(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (user) {
      throw ApiError.badRequest("A user with this email already exists");
    }
  }

  static async updateUser(
    userId: ObjectId | string,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new:        true,
      runValidators: true,
    });
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }
}

export default UserService;
