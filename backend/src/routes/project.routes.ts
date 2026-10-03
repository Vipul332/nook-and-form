import { Router } from "express";

import {
  createProjectController,
  deleteProjectController,
  getAdminProjectController,
  getPublicProjectController,
  listAdminProjectsController,
  listPublicProjectsController,
  publishProjectController,
  removeProjectImageController,
  unpublishProjectController,
  updateProjectController,
} from "../controllers/project.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";
import { uploadDesignImages } from "../middleware/upload.middleware";

const router = Router();

// Public project catalog
router.get("/projects", listPublicProjectsController);

router.get("/projects/:slug", getPublicProjectController);

// Admin project management
router.post(
  "/admin/projects",
  adminAuthMiddleware,
  uploadDesignImages.fields([
    { name: "images", maxCount: 10 },
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  createProjectController
);

router.get(
  "/admin/projects",
  adminAuthMiddleware,
  listAdminProjectsController
);

router.get(
  "/admin/projects/:id",
  adminAuthMiddleware,
  getAdminProjectController
);

router.patch(
  "/admin/projects/:id",
  adminAuthMiddleware,
  uploadDesignImages.fields([
    { name: "images", maxCount: 10 },
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  updateProjectController
);

router.delete(
  "/admin/projects/:id",
  adminAuthMiddleware,
  deleteProjectController
);

router.patch(
  "/admin/projects/:id/publish",
  adminAuthMiddleware,
  publishProjectController
);

router.patch(
  "/admin/projects/:id/unpublish",
  adminAuthMiddleware,
  unpublishProjectController
);

router.delete(
  "/admin/projects/:id/images",
  adminAuthMiddleware,
  removeProjectImageController
);

export default router;