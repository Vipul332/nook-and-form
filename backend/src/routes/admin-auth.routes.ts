import { Router } from "express";

import {
  adminLoginController,
  getAdminMeController,
  adminLogoutController,
} from "../controllers/admin-auth.controller";

import { validate } from "../middleware/validate.middleware";

import { adminLoginSchema } from "../schemas/admin.schema";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

import { asyncHandler } from "../utils/async-handler";

import { authRateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post(
  "/login",
  authRateLimiter,
  validate(adminLoginSchema),
  asyncHandler(adminLoginController)
);

router.get(
  "/me",
  adminAuthMiddleware,
  asyncHandler(getAdminMeController)
);

router.post(
  "/logout",
  adminAuthMiddleware,
  asyncHandler(adminLogoutController)
);

export default router;