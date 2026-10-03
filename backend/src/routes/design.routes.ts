import { Router } from "express";
import {
  archiveDesignController,
  createDesignController,
  deleteDesignController,
  getAdminDesignController,
  getPublicDesignController,
  listAdminDesignsController,
  listPublicDesignsController,
  publishDesignController,
  removeDesignImageController,
  unarchiveDesignController,
  unpublishDesignController,
  updateDesignController,
} from "../controllers/design.controller";
import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";
import { uploadDesignImages } from "../middleware/upload.middleware";

const router = Router();


router.get(
  "/designs",
  listPublicDesignsController
);

router.get(
  "/designs/:slug",
  getPublicDesignController
);


router.post(
  "/admin/designs",
  adminAuthMiddleware,
  uploadDesignImages.array("images", 10),
  createDesignController
);

router.get(
  "/admin/designs",
  adminAuthMiddleware,
  listAdminDesignsController
);

router.get(
  "/admin/designs/:id",
  adminAuthMiddleware,
  getAdminDesignController
);

router.patch(
  "/admin/designs/:id",
  adminAuthMiddleware,
  uploadDesignImages.array("images", 10),
  updateDesignController
);

router.delete(
  "/admin/designs/:id",
  adminAuthMiddleware,
  deleteDesignController
);

router.patch(
  "/admin/designs/:id/archive",
  adminAuthMiddleware,
  archiveDesignController
);

router.patch(
  "/admin/designs/:id/unarchive",
  adminAuthMiddleware,
  unarchiveDesignController
);

router.patch(
  "/admin/designs/:id/publish",
  adminAuthMiddleware,
  publishDesignController
);

router.patch(
  "/admin/designs/:id/unpublish",
  adminAuthMiddleware,
  unpublishDesignController
);

router.delete(
  "/admin/designs/:id/images",
  adminAuthMiddleware,
  removeDesignImageController
);

export default router;