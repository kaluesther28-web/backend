import otpGenerator from "otp-generator";
import OTP from "../modules/otp/otp.model.js";

export const generateAndSaveOTP = async (email: string): Promise<string> => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Delete any existing OTP for this email
  await OTP.deleteMany({ email });

  // Save new OTP
  await OTP.create({ email, otp });

  return otp;
};
