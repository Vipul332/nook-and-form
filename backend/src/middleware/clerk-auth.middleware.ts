import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/api-error";

export interface AuthenticatedRequest extends Request {
  authUserId?: string;
}

export const requireClerkAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  req.authUserId = userId;

  next();
};