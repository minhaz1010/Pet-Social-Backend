import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_WEBHOOK_SECRET_KEY: process.env.CLERK_WEBHOOK_SECRET_KEY,
  AMARPAY_API: process.env.AMARPAY_API,
  PAYMENT_VERIFY_URL: process.env.PAYMENT_VERIFY_URL,
  SIGNATURE_KEY: process.env.SIGNATURE_KEY,
  STORE_ID: process.env.STORE_ID,
  CANCEL_URL: process.env.CANCEL_URL,
  BACKEND_URL: process.env.BACKEND_URL,
};
