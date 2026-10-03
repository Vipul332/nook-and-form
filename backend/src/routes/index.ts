import { Router } from "express";

import adminAuthRoutes from "./admin-auth.routes";

import clerkAuthRoutes from "./clerk-auth.routes";

import clerkTestRoutes from "./clerk-test.routes";

import designRoutes from "./design.routes";

import projectRoutes from "./project.routes";

import serviceRoutes from "./service.routes";

import testimonialRoutes from "./testimonial.routes";

import consultationRoutes from "./consultation.routes";

import settingsRoutes from "./settings.routes";

import aboutRoutes from "./about.routes";

const router = Router();

router.use("/admin/auth", adminAuthRoutes);

router.use("/clerk-auth", clerkAuthRoutes);

router.use("/clerk-test", clerkTestRoutes);

router.use("/", designRoutes);

router.use("/", projectRoutes);

router.use("/", serviceRoutes);

router.use("/", testimonialRoutes);

router.use("/", consultationRoutes);

router.use("/", settingsRoutes);

router.use("/", aboutRoutes);

export default router;