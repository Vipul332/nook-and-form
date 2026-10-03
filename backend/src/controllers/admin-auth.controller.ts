import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import Admin from "../models/Admin";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import { generateAdminToken } from "../utils/admin-jwt";
import {
  AuthenticatedAdminRequest,
} from "../middleware/admin-auth.middleware";

export const adminLoginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({
    email: email.toLowerCase().trim(),
  }).select("+passwordHash");

  if (!admin) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  if (!admin.isActive) {
    throw new ApiError(
      403,
      "Admin account is inactive"
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    admin.passwordHash
  );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  admin.lastLoginAt = new Date();

  await admin.save();

  const token = generateAdminToken(
    admin._id.toString(),
    admin.role
  );

  sendSuccess(res, {
    statusCode: 200,
    message: "Admin login successful",
    data: {
      token,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
};

export const getAdminMeController = async (
  req: AuthenticatedAdminRequest,
  res: Response
): Promise<void> => {
  if (!req.admin) {
    throw new ApiError(
      401,
      "Admin authentication required"
    );
  }

  sendSuccess(res, {
    statusCode: 200,
    message: "Admin fetched successfully",
    data: {
      admin: req.admin,
    },
  });
};

export const adminLogoutController = async (
  _req: AuthenticatedAdminRequest,
  res: Response
): Promise<void> => {
  sendSuccess(res, {
    statusCode: 200,
    message: "Admin logged out successfully",
  });
};