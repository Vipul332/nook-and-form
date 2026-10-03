import dotenv from "dotenv";

dotenv.config();

const env = {
  // Application
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // Database
  mongodbUri: process.env.MONGODB_URI || "",

  // =========================================================
  // Legacy Authentication
  // =========================================================
  // These are kept temporarily during the Clerk migration.
  // We will remove them after Clerk authentication is fully
  // implemented and tested.
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  adminJwtSecret: process.env.ADMIN_JWT_SECRET || "",
  adminJwtExpiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "1d",

  // =========================================================
  // Clerk Authentication
  // =========================================================
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY || "",

  // =========================================================
  // Cloudinary
  // =========================================================
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  // =========================================================
  // Legacy OTP / MSG91
  // =========================================================
  // Kept temporarily during migration.
  // This will be removed once Clerk email/password
  // authentication is completely working.
  otp: {
    provider: process.env.OTP_PROVIDER || "msg91",
    msg91AuthKey: process.env.MSG91_AUTH_KEY || "",
    msg91TemplateId: process.env.MSG91_TEMPLATE_ID || "",
  },

  // =========================================================
  // AI
  // =========================================================
  ai: {
    provider: process.env.AI_PROVIDER || "",
    apiKey: process.env.AI_API_KEY || "",
  },

  // =========================================================
  // Email
  // =========================================================
  email: {
    provider: process.env.EMAIL_PROVIDER || "resend",
    apiKey: process.env.EMAIL_API_KEY || "",
  },

  // =========================================================
  // Business Information
  // =========================================================
  business: {
    name: process.env.BUSINESS_NAME || "",
    email: process.env.BUSINESS_EMAIL || "",
    whatsapp: process.env.BUSINESS_WHATSAPP || "",
  },
};

export default env;