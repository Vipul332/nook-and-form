import { Router } from "express";

import {
  uploadServiceImage,
} from "../middleware/upload.middleware";

import {
  createServiceController,
  deleteServiceController,
  getAdminServiceController,
  getPublicServiceController,
  listAdminServicesController,
  listPublicServicesController,
  publishServiceController,
  unpublishServiceController,
  updateServiceController,
} from "../controllers/service.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

/* =========================================================
   PUBLIC SERVICE CATALOG
========================================================= */

// GET /api/services
router.get(
  "/services",
  listPublicServicesController
);

// GET /api/services/:slug
router.get(
  "/services/:slug",
  getPublicServiceController
);

/* =========================================================
   ADMIN SERVICE CMS
========================================================= */

// POST /api/admin/services
router.post(
  "/admin/services",
  adminAuthMiddleware,
  uploadServiceImage.single("image"),
  createServiceController
);

// GET /api/admin/services
router.get(
  "/admin/services",
  adminAuthMiddleware,
  listAdminServicesController
);

// GET /api/admin/services/:id
router.get(
  "/admin/services/:id",
  adminAuthMiddleware,
  getAdminServiceController
);

// PATCH /api/admin/services
router.patch(
  "/admin/services",
  adminAuthMiddleware,
  uploadServiceImage.single("image"),
  updateServiceController
);

// DELETE /api/admin/services/:id
router.delete(
  "/admin/services/:id",
  adminAuthMiddleware,
  deleteServiceController
);

// PATCH /api/admin/services/publish
router.patch(
  "/admin/services/publish",
  adminAuthMiddleware,
  publishServiceController
);

// PATCH /api/admin/services/unpublish
router.patch(
  "/admin/services/unpublish",
  adminAuthMiddleware,
  unpublishServiceController
);

export default router;