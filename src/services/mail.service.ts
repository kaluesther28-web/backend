import Handlebars from "handlebars";
import { env } from "../config/env.config.js";
import logger from "../utils/logger.js";

const OTP_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin: 0; padding: 0; background: #0d0d0d; font-family: -apple-system, sans-serif; }
    .wrapper { max-width: 480px; margin: 40px auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #222; }
    .header { background: #000; padding: 32px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 24px; font-weight: 800; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.5); font-size: 13px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; color: #fff; font-weight: 600; margin-bottom: 8px; }
    .intro { font-size: 14px; color: #999; line-height: 22px; margin-bottom: 28px; }
    .otp-wrap { background: #000; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px; border: 1px solid #222; }
    .otp-label { font-size: 11px; font-weight: 700; color: #555; letter-spacing: 1.2px; margin-bottom: 8px; text-transform: uppercase; }
    .otp-code { font-size: 48px; font-weight: 800; color: #00C853; letter-spacing: 12px; line-height: 1; }
    .otp-expiry { font-size: 12px; color: #555; margin-top: 10px; }
    .warning { font-size: 13px; color: #666; line-height: 20px; padding: 14px; background: #111; border-radius: 8px; border: 1px solid #222; margin-bottom: 24px; }
    .footer { padding: 20px 32px; background: #111; border-top: 1px solid #222; text-align: center; font-size: 11px; color: #555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>GoWell 🔧</h1>
      <p>Help is always nearby</p>
    </div>
    <div class="body">
      <div class="greeting">Hello {{firstName}},</div>
      <div class="intro">{{message}}</div>
      <div class="otp-wrap">
        <div class="otp-label">Your One-Time Password</div>
        <div class="otp-code">{{otp}}</div>
        <div class="otp-expiry">Expires in 5 minutes</div>
      </div>
      <div class="warning">
        Do not share this code with anyone. GoWell will never ask for your OTP.
      </div>
    </div>
    <div class="footer">
      © 2025 GoWell Solutions, Lagos Nigeria.
    </div>
  </div>
</body>
</html>
`;

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to:      string;
  subject: string;
  text:    string;
  html:    string;
}) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key":      env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      // sender:      { name: env.BREVO_SENDER_NAME, email: env.BREVO_SENDER_EMAIL },
            sender:      { name: "GOwell", email: "ndukwesamuel23@gmail.com" },
      to:          [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    logger.error(`Brevo API error: ${err}`);
    throw new Error(`Failed to send email: ${err}`);
  }

  const info = await response.json();
  logger.info(`Email sent to ${to} via Brevo API`);
  return info;
};

const sendOTPViaEmail = async (
  email:     string,
  otp:       string,
  firstName: string = "there"
) => {
  const message  = "Use the OTP below to verify your GoWell account. This code expires in 5 minutes.";
  const text     = `Hello ${firstName},\n\n${message}\n\nYour OTP is: ${otp}\n\nDo not share this with anyone.`;
  const template = Handlebars.compile(OTP_TEMPLATE);
  const html     = template({ firstName, otp, message });

  return sendEmail({ to: email, subject: "Your GoWell OTP Code", text, html });
};

const sendPasswordResetOTP = async (
  email:     string,
  otp:       string,
  firstName: string = "there"
) => {
  const message  = "You requested a password reset. Use the OTP below to reset your GoWell password.";
  const text     = `Hello ${firstName},\n\n${message}\n\nYour OTP is: ${otp}\n\nDo not share this with anyone.`;
  const template = Handlebars.compile(OTP_TEMPLATE);
  const html     = template({ firstName, otp, message });

  return sendEmail({ to: email, subject: "GoWell — Reset Your Password", text, html });
};

export const mailService = { sendEmail, sendOTPViaEmail, sendPasswordResetOTP };