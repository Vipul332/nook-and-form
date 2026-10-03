
import { Router } from "express";
import {
  createTestimonialController,
  deleteTestimonialController,
  getAdminTestimonialController,
  listAdminTestimonialsController,
  listPublicTestimonialsController,
  publishTestimonialController,
  unpublishTestimonialController,
  updateTestimonialController,
} from "../controllers/testimonial.controller";
import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";
import { uploadServiceImage } from "../middleware/upload.middleware";

const router = Router();

// Public
router.get(
  "/testimonials",
  listPublicTestimonialsController
);

// Admin
router.post(
  "/admin/testimonials",
  adminAuthMiddleware,
  uploadServiceImage.single("image"),
  createTestimonialController
);

router.get(
  "/admin/testimonials",
  adminAuthMiddleware,
  listAdminTestimonialsController
);

router.get(
  "/admin/testimonials/:id",
  adminAuthMiddleware,
  getAdminTestimonialController
);

router.patch(
  "/admin/testimonials/:id",
  adminAuthMiddleware,
  uploadServiceImage.single("image"),
  updateTestimonialController
);

router.delete(
  "/admin/testimonials/:id",
  adminAuthMiddleware,
  deleteTestimonialController
);

router.patch(
  "/admin/testimonials/:id/publish",
  adminAuthMiddleware,
  publishTestimonialController
);

router.patch(
  "/admin/testimonials/:id/unpublish",
  adminAuthMiddleware,
  unpublishTestimonialController
);

export default router;