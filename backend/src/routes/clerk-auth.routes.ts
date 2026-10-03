import { Router, Request, Response } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

router.get("/me", (req: Request, res: Response) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Clerk authentication is working",
    userId,
  });
});

export default router;