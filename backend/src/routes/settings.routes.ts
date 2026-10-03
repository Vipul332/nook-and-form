import { Router } from "express";

import {
  getSettingsController,
  createSettingsController,
  updateSettingsController,
} from "../controllers/settings.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

/* =========================================================
   Public
========================================================= */

router.get("/settings", getSettingsController);

/* =========================================================
   Admin
========================================================= */

router.post(
  "/admin/settings",
  adminAuthMiddleware,
  createSettingsController
);

router.patch(
  "/admin/settings",
  adminAuthMiddleware,
  updateSettingsController
);

export default router;