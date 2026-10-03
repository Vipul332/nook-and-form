import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import mongoose from "mongoose";
import multer from "multer";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error("Request error", error);

  // Custom API errors
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details !== undefined
        ? { details: error.details }
        : {}),
    });
    return;
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.flatten(),
    });
    return;
  }

  // Multer upload errors
  if (error instanceof multer.MulterError) {
    let message = "File upload failed";

    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        message = "Image file size must not exceed 5 MB";
        break;

      case "LIMIT_FILE_COUNT":
        message = "You can upload a maximum of 10 images";
        break;

      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field in upload request";
        break;

      case "LIMIT_FIELD_COUNT":
        message = "Too many form fields";
        break;

      default:
        message = "File upload failed";
    }

    res.status(400).json({
      success: false,
      message,
      details: {
        code: error.code,
        field: error.field,
      },
    });
    return;
  }

  // Custom image MIME-type validation error
  if (
    error instanceof Error &&
    error.message === "Only JPG, PNG and WEBP images are allowed"
  ) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map(
      (validationError) => ({
        field: validationError.path,
        message: validationError.message,
      })
    );

    res.status(400).json({
      success: false,
      message: "Database validation failed",
      details,
    });
    return;
  }

  // Invalid MongoDB ObjectId
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
    return;
  }

  // MongoDB duplicate-key error
  if (
    error instanceof Error &&
    error.name === "MongoServerError"
  ) {
    const mongoError = error as Error & {
      code?: number;
      keyPattern?: Record<string, unknown>;
      keyValue?: Record<string, unknown>;
    };

    if (mongoError.code === 11000) {
      res.status(409).json({
        success: false,
        message: "A record with this value already exists",
        ...(mongoError.keyValue
          ? {
              details: {
                duplicate: mongoError.keyValue,
              },
            }
          : {}),
      });
      return;
    }
  }

  // Cloudinary / external image service errors
  if (
    error instanceof Error &&
    error.name === "CloudinaryError"
  ) {
    res.status(502).json({
      success: false,
      message: "Image service is temporarily unavailable",
    });
    return;
  }

  // Unknown / unhandled errors
  const isProduction =
    process.env.NODE_ENV === "production";

  res.status(500).json({
    success: false,
    message: isProduction
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Internal server error",

    ...(isProduction
      ? {}
      : {
          stack:
            error instanceof Error
              ? error.stack
              : undefined,
        }),
  });
};