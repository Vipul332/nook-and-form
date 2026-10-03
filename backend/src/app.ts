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

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = new Set([
  env.clientUrl,
  "http://localhost:3000",
  "https://nook-and-form.vercel.app",
]);

const isAllowedVercelOrigin = (origin: string): boolean => {
  return /^https:\/\/nook-and-form(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(
    origin
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests or health checks.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        allowedOrigins.has(origin) ||
        isAllowedVercelOrigin(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
      );
    },

    credentials: true,
  })
);

/* =========================================================
   SECURITY
========================================================= */

app.use(securityMiddleware);

/* =========================================================
   CLERK
========================================================= */

app.use(clerkMiddleware());

/* =========================================================
   BODY PARSING
========================================================= */

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

/* =========================================================
   RATE LIMITING
========================================================= */

app.use(generalRateLimiter);

/* =========================================================
   HEALTH CHECK
========================================================= */

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

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api", apiRoutes);

/* =========================================================
   ERROR HANDLING
========================================================= */

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;