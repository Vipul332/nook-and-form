import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env";
import { AdminJwtPayload } from "../types/admin";

export const generateAdminToken = (
  adminId: string,
  role: "ADMIN" | "SUPER_ADMIN"
): string => {
  if (!env.adminJwtSecret) {
    throw new Error("ADMIN_JWT_SECRET is not configured");
  }

  const payload: AdminJwtPayload = {
    adminId,
    role,
    type: "admin",
  };

  const options: SignOptions = {
    expiresIn:
      env.adminJwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(
    payload,
    env.adminJwtSecret,
    options
  );
};

export const verifyAdminToken = (
  token: string
): AdminJwtPayload => {
  if (!env.adminJwtSecret) {
    throw new Error("ADMIN_JWT_SECRET is not configured");
  }

  const decoded = jwt.verify(
    token,
    env.adminJwtSecret
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    decoded.type !== "admin" ||
    typeof decoded.adminId !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid admin token");
  }

  return decoded as AdminJwtPayload;
};