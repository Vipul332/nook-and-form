import express, { Request, Response } from "express";
import cors from "cors";
import env from "./config/env";
import { securityMiddleware } from "./middleware/security.middleware";
import { generalRateLimiter } from "./middleware/rate-limit.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import apiRoutes from "./routes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.disable("x-powered-by");

app.use(securityMiddleware);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(clerkMiddleware());

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(generalRateLimiter);

app.get(
  "/api/health",
  (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message:
        "Interior Design Platform API is running",
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  }
);
app.use("/api", apiRoutes);
app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;