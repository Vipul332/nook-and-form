import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";
import { ApiError } from "../utils/api-error";
import { verifyAdminToken } from "../utils/admin-jwt";

export interface AuthenticatedAdminRequest
  extends Request {
  admin?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN";
    isActive: boolean;
  };
}

export const adminAuthMiddleware = async (
  req: AuthenticatedAdminRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new ApiError(
        401,
        "Admin authentication required"
      );
    }

    const [scheme, token] =
      authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(
        401,
        "Invalid authorization header"
      );
    }

    const payload = verifyAdminToken(token);

    const admin = await Admin.findById(
      payload.adminId
    );

    if (!admin) {
      throw new ApiError(
        401,
        "Admin account no longer exists"
      );
    }

    if (!admin.isActive) {
      throw new ApiError(
        403,
        "Admin account is inactive"
      );
    }

    req.admin = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    };

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(
            401,
            "Invalid or expired admin token"
          )
    );
  }
};