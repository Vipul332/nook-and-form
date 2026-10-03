import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

import {
  createAbout,
  getAbout,
  getPublishedAbout,
  publishAbout,
  unpublishAbout,
  updateAbout,
} from "../services/about/about.service";

import {
  createAboutSchema,
  updateAboutSchema,
} from "../schemas/about.schema";

/* =========================================================
   Admin - Get About
========================================================= */

export const getAdminAboutController =
  asyncHandler(async (_req, res) => {
    const about = await getAbout();

    return sendSuccess(res, {
      message: "About content fetched successfully",
      data: about,
    });
  });

/* =========================================================
   Public - Get About
========================================================= */

export const getPublicAboutController =
  asyncHandler(async (_req, res) => {
    const about = await getPublishedAbout();

    if (!about) {
      throw new ApiError(
        404,
        "Published About content not found"
      );
    }

    return sendSuccess(res, {
      message: "About content fetched successfully",
      data: about,
    });
  });

/* =========================================================
   Admin - Create About
========================================================= */

export const createAboutController =
  asyncHandler(async (req, res) => {
    const parsed = createAboutSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const existingAbout = await getAbout();

    if (existingAbout) {
      throw new ApiError(
        409,
        "About content already exists"
      );
    }

    const about = await createAbout(
      parsed.data
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "About content created successfully",
      data: about,
    });
  });

/* =========================================================
   Admin - Update About
========================================================= */

export const updateAboutController =
  asyncHandler(async (req, res) => {
    const parsed = updateAboutSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const about = await updateAbout(
      parsed.data
    );

    return sendSuccess(res, {
      message: "About content updated successfully",
      data: about,
    });
  });

/* =========================================================
   Admin - Publish About
========================================================= */

export const publishAboutController =
  asyncHandler(async (_req, res) => {
    const about = await publishAbout();

    return sendSuccess(res, {
      message: "About content published successfully",
      data: about,
    });
  });

/* =========================================================
   Admin - Unpublish About
========================================================= */

export const unpublishAboutController =
  asyncHandler(async (_req, res) => {
    const about = await unpublishAbout();

    return sendSuccess(res, {
      message: "About content unpublished successfully",
      data: about,
    });
  });