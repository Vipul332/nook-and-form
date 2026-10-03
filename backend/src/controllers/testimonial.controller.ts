import { Request, Response } from "express";
import { Types } from "mongoose";
import Testimonial from "../models/Testimonial";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  testimonialQuerySchema,
} from "../schemas/testimonial.schema";
import { uploadTestimonialImage } from "../services/cloudinary/testimonial-image.service";

const validateId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid testimonial ID");
  }
};

const normalizeBody = (body: Record<string, unknown>) => {
  const normalized = { ...body };

  // Empty optional form fields should not fail URL validation.
  if (normalized.imageUrl === "") {
    delete normalized.imageUrl;
  }

  if (normalized.role === "") {
    delete normalized.role;
  }

  return normalized;
};

export const listPublicTestimonialsController =
  asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await Testimonial.find({
      published: true,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, {
      message: "Testimonials fetched successfully",
      data: testimonials,
    });
  });

export const listAdminTestimonialsController =
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = testimonialQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid testimonial query",
        parsed.error.flatten()
      );
    }

    const { page, limit, published } = parsed.data;
    const filter: Record<string, unknown> = {};

    if (published !== undefined) {
      filter.published = published === "true";
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Testimonial.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      message: "Testimonials fetched successfully",
      data: {
        testimonials,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  });

export const getAdminTestimonialController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return sendSuccess(res, {
      message: "Testimonial fetched successfully",
      data: testimonial,
    });
  });

export const createTestimonialController =
  asyncHandler(async (req: Request, res: Response) => {
    const body = normalizeBody(
      req.body as Record<string, unknown>
    );

    const parsed = createTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    let imageUrl = parsed.data.imageUrl;

    if (req.file) {
      const uploaded = await uploadTestimonialImage(req.file);
      imageUrl = uploaded.url;
    }

    const testimonial = await Testimonial.create({
      ...parsed.data,
      ...(imageUrl ? { imageUrl } : {}),
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  });

export const updateTestimonialController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const body = normalizeBody(
      req.body as Record<string, unknown>
    );

    const parsed = updateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const updateData: Record<string, unknown> = {
      ...parsed.data,
    };

    if (req.file) {
      const uploaded = await uploadTestimonialImage(req.file);
      updateData.imageUrl = uploaded.url;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return sendSuccess(res, {
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  });

export const deleteTestimonialController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return sendSuccess(res, {
      message: "Testimonial deleted successfully",
      data: testimonial,
    });
  });

export const publishTestimonialController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: { published: true } },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return sendSuccess(res, {
      message: "Testimonial published successfully",
      data: testimonial,
    });
  });

export const unpublishTestimonialController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: { published: false } },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return sendSuccess(res, {
      message: "Testimonial unpublished successfully",
      data: testimonial,
    });
  });