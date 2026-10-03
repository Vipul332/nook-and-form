import { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

import {
  createSettings,
  getSettings,
  updateSettings,
} from "../services/service/settings.service";
import {
  createSettingsSchema,
  updateSettingsSchema,
} from "../schemas/settings.schema";

/* =========================================================
   GET SETTINGS
   Public
========================================================= */

export const getSettingsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await getSettings();

    if (!settings) {
      throw new ApiError(404, "Settings not found");
    }

    return sendSuccess(res, {
      data: settings,
      message: "Settings fetched successfully",
    });
  }
);

/* =========================================================
   CREATE SETTINGS
   Admin
========================================================= */

export const createSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = createSettingsSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(
        400,
        validation.error.issues[0]?.message ||
          "Invalid settings data"
      );
    }

    const settings = await createSettings(validation.data);

    return sendSuccess(res, {
      statusCode: 201,
      data: settings,
      message: "Settings created successfully",
    });
  }
);

/* =========================================================
   UPDATE SETTINGS
   Admin
========================================================= */

export const updateSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = updateSettingsSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(
        400,
        validation.error.issues[0]?.message ||
          "Invalid settings data"
      );
    }

    const settings = await updateSettings(validation.data);

    return sendSuccess(res, {
      data: settings,
      message: "Settings updated successfully",
    });
  }
);