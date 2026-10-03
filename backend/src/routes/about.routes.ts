import { Router } from "express";

import {
  createAboutController,
  getAdminAboutController,
  getPublicAboutController,
  publishAboutController,
  unpublishAboutController,
  updateAboutController,
} from "../controllers/about.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

/* =========================================================
   PUBLIC ABOUT
========================================================= */

// GET /api/about
router.get(
  "/about",
  getPublicAboutController
);

/* =========================================================
   ADMIN ABOUT CMS
========================================================= */

// GET /api/admin/about
router.get(
  "/admin/about",
  adminAuthMiddleware,
  getAdminAboutController
);

// POST /api/admin/about
router.post(
  "/admin/about",
  adminAuthMiddleware,
  createAboutController
);

// PATCH /api/admin/about
router.patch(
  "/admin/about",
  adminAuthMiddleware,
  updateAboutController
);

// PATCH /api/admin/about/publish
router.patch(
  "/admin/about/publish",
  adminAuthMiddleware,
  publishAboutController
);

// PATCH /api/admin/about/unpublish
router.patch(
  "/admin/about/unpublish",
  adminAuthMiddleware,
  unpublishAboutController
);

export default router;