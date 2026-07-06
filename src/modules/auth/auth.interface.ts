export interface RegisterDTO {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  password:    string;
  [key: string]: any;
}

export interface LoginDTO {
  email:    string;
  password: string;
}

export interface OTPData {
  email: string;
  otp:   string;
}

export interface ResetPasswordDTO {
  email:    string;
  otp:      string;
  password: string;
}
