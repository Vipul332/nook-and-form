import { Response } from "express";

import {
  AuthenticatedRequest,
} from "../middleware/clerk-auth.middleware";

export const clerkTestController = (
  req: AuthenticatedRequest,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    message: "Clerk authentication is working",
    data: {
      clerkUserId: req.authUserId,
    },
  });
};