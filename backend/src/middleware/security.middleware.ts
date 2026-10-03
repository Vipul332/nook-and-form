import { RequestHandler } from "express";
import helmet from "helmet";

export const securityMiddleware: RequestHandler =
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  });