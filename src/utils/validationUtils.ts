import bcrypt from "bcryptjs";
import { ApiError } from "./responseHandler.js";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<void> => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }
};
