import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import {
  archiveDesign,
  createDesign,
  deleteDesign,
  getDesignById,
  getDesigns,
  getPublicDesignBySlug,
  publishDesign,
  removeDesignImage,
  unarchiveDesign,
  unpublishDesign,
  updateDesign,
} from "../services/design/design.services";
import {
  createDesignSchema,
  designQuerySchema,
  updateDesignSchema,
} from "../schemas/design.schema";
import { ApiError } from "../utils/api-error";

const getFiles = (
  req: Request
): Express.Multer.File[] => {
  if (!req.files) {
    return [];
  }

  if (Array.isArray(req.files)) {
    return req.files;
  }

  return Object.values(req.files).flat();
};

export const createDesignController = asyncHandler(
  async (req, res) => {
    const parsed = createDesignSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const design = await createDesign(
      parsed.data,
      getFiles(req)
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Design created successfully",
      data: design,
    });
  }
);

export const listAdminDesignsController =
  asyncHandler(async (req, res) => {
    const parsed = designQuerySchema.safeParse(
      req.query
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid design query",
        parsed.error.flatten()
      );
    }

    const result = await getDesigns(
      parsed.data,
      false
    );

    return sendSuccess(res, {
      message: "Designs fetched successfully",
      data: result,
    });
  });

export const listPublicDesignsController =
  asyncHandler(async (req, res) => {
    const parsed = designQuerySchema.safeParse(
      req.query
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid design query",
        parsed.error.flatten()
      );
    }

    const result = await getDesigns(
      parsed.data,
      true
    );

    return sendSuccess(res, {
      message: "Designs fetched successfully",
      data: result,
    });
  });

export const getAdminDesignController =
  asyncHandler(async (req, res) => {
    const design = await getDesignById(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Design fetched successfully",
      data: design,
    });
  });

export const getPublicDesignController =
  asyncHandler(async (req, res) => {
    const design = await getPublicDesignBySlug(
      req.params.slug as string
    );

    return sendSuccess(res, {
      message: "Design fetched successfully",
      data: design,
    });
  });

export const updateDesignController =
  asyncHandler(async (req, res) => {
    const parsed = updateDesignSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const design = await updateDesign(
      req.params.id as string,
      parsed.data,
      getFiles(req)
    );

    return sendSuccess(res, {
      message: "Design updated successfully",
      data: design,
    });
  });

export const deleteDesignController =
  asyncHandler(async (req, res) => {
    await deleteDesign(req.params.id as string);

    return sendSuccess(res, {
      message: "Design deleted successfully",
    });
  });

export const archiveDesignController =
  asyncHandler(async (req, res) => {
    const design = await archiveDesign(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Design archived successfully",
      data: design,
    });
  });

export const publishDesignController =
  asyncHandler(async (req, res) => {
    const design = await publishDesign(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Design published successfully",
      data: design,
    });
  });

export const unpublishDesignController =
  asyncHandler(async (req, res) => {
    const design = await unpublishDesign(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Design unpublished successfully",
      data: design,
    });
  });

export const unarchiveDesignController =
  asyncHandler(async (req, res) => {
    const design = await unarchiveDesign(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Design unarchived successfully",
      data: design,
    });
  });

export const removeDesignImageController =
  asyncHandler(async (req, res) => {
    const design = await removeDesignImage(
      req.params.id as string,
      req.body.publicId as string
    );

    return sendSuccess(res, {
      message: "Design image removed successfully",
      data: design,
    });
  });