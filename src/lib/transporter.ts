import nodemailer from "nodemailer";
import { env } from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  host:   "smtp-relay.brevo.com",
  port:   587,
  secure: false,
  auth: {
    user: env.BREVO_EMAIL,
    pass: env.BREVO_PASSWORD,
  },
});

export default transporter;
