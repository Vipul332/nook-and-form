import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  getPublicServiceBySlug,
  publishService,
  unpublishService,
  updateService,
} from "../services/service/service.service";

import {
  uploadServiceImage,
} from "../services/cloudinary/service-image.service";

import {
  createServiceSchema,
  serviceQuerySchema,
  updateServiceSchema,
} from "../schemas/service.schema";

/* =========================================================
   Create Service
========================================================= */

export const createServiceController =
  asyncHandler(async (req, res) => {
    const parsed = createServiceSchema.safeParse(
      req.body
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    let imageUrl = parsed.data.image;

    if (req.file) {
      const uploaded = await uploadServiceImage(
        req.file
      );

      imageUrl = uploaded.url;
    }

    const service = await createService({
      ...parsed.data,
      ...(imageUrl
        ? { image: imageUrl }
        : {}),
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Service created successfully",
      data: service,
    });
  });

/* =========================================================
   Admin Service List
========================================================= */

export const listAdminServicesController =
  asyncHandler(async (req, res) => {
    const parsed = serviceQuerySchema.safeParse(
      req.query
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid service query",
        parsed.error.flatten()
      );
    }

    const result = await getServices(
      parsed.data,
      false
    );

    return sendSuccess(res, {
      message: "Services fetched successfully",
      data: result,
    });
  });

/* =========================================================
   Public Service List
========================================================= */

export const listPublicServicesController =
  asyncHandler(async (req, res) => {
    const parsed = serviceQuerySchema.safeParse(
      req.query
    );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid service query",
        parsed.error.flatten()
      );
    }

    const result = await getServices(
      parsed.data,
      true
    );

    return sendSuccess(res, {
      message: "Services fetched successfully",
      data: result,
    });
  });

/* =========================================================
   Admin Get Service
========================================================= */

export const getAdminServiceController =
  asyncHandler(async (req, res) => {
    const service = await getServiceById(
      req.params.id as string
    );

    return sendSuccess(res, {
      message: "Service fetched successfully",
      data: service,
    });
  });

/* =========================================================
   Public Get Service
========================================================= */

export const getPublicServiceController =
  asyncHandler(async (req, res) => {
    const service =
      await getPublicServiceBySlug(
        req.params.slug as string
      );

    return sendSuccess(res, {
      message: "Service fetched successfully",
      data: service,
    });
  });

/* =========================================================
   Update Service
========================================================= */

export const updateServiceController =
  asyncHandler(async (req, res) => {
    const { _id, ...serviceData } = req.body;

    if (
      typeof _id !== "string" ||
      !_id.trim()
    ) {
      throw new ApiError(
        400,
        "_id is required"
      );
    }

    const parsed =
      updateServiceSchema.safeParse(
        serviceData
      );

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    let updateData = parsed.data;

    if (req.file) {
      const uploaded =
        await uploadServiceImage(req.file);

      updateData = {
        ...updateData,
        image: uploaded.url,
      };
    }

    const service = await updateService(
      _id,
      updateData
    );

    return sendSuccess(res, {
      message: "Service updated successfully",
      data: service,
    });
  });

/* =========================================================
   Delete Service
========================================================= */

export const deleteServiceController =
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;

    if (
      typeof id !== "string" ||
      !id.trim()
    ) {
      throw new ApiError(
        400,
        "Service id is required"
      );
    }

    await deleteService(id);

    return sendSuccess(res, {
      message: "Service deleted successfully",
    });
  });

/* =========================================================
   Publish Service
========================================================= */

export const publishServiceController =
  asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (
      typeof _id !== "string" ||
      !_id.trim()
    ) {
      throw new ApiError(
        400,
        "_id is required"
      );
    }

    const service = await publishService(
      _id
    );

    return sendSuccess(res, {
      message: "Service published successfully",
      data: service,
    });
  });

/* =========================================================
   Unpublish Service
========================================================= */

export const unpublishServiceController =
  asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (
      typeof _id !== "string" ||
      !_id.trim()
    ) {
      throw new ApiError(
        400,
        "_id is required"
      );
    }

    const service =
      await unpublishService(_id);

    return sendSuccess(res, {
      message: "Service unpublished successfully",
      data: service,
    });
  });