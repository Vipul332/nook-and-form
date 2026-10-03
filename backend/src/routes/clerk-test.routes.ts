import { Router } from "express";

import {
  clerkTestController,
} from "../controllers/clerk-test.controller";

import {
  requireClerkAuth,
} from "../middleware/clerk-auth.middleware";

const router = Router();

router.get(
  "/protected",
  requireClerkAuth,
  clerkTestController
);

export default router;