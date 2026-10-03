
import { Router } from "express";

import {
  createConsultationController,
  deleteConsultationController,
  getAdminConsultationController,
  listAdminConsultationsController,
  updateConsultationController,
} from "../controllers/consultation.controller";

import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";

const router = Router();

// Public: submit a consultation request
router.post(
  "/consultations",
  createConsultationController
);

// Admin: manage consultation requests
router.get(
  "/admin/consultations",
  adminAuthMiddleware,
  listAdminConsultationsController
);

router.get(
  "/admin/consultations/:id",
  adminAuthMiddleware,
  getAdminConsultationController
);

router.patch(
  "/admin/consultations/:id",
  adminAuthMiddleware,
  updateConsultationController
);

router.delete(
  "/admin/consultations/:id",
  adminAuthMiddleware,
  deleteConsultationController
);

export default router;