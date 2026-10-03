import { Request, Response } from "express";
import { Types } from "mongoose";

import Consultation from "../models/Consultation";
import {
  createConsultationSchema,
  updateConsultationSchema,
  consultationQuerySchema,
} from "../schemas/consultation.schema";
import { sendConsultationNotification } from "../services/email/email.service";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

const validateId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid consultation ID");
  }
};

const normalizeBody = (body: Record<string, unknown>) => {
  const normalized = { ...body };

  for (const field of [
    "preferredTime",
    "location",
    "message",
  ]) {
    if (normalized[field] === "") {
      delete normalized[field];
    }
  }

  return normalized;
};

// Public: submit a consultation request
export const createConsultationController =
  asyncHandler(async (req: Request, res: Response) => {
    const body = normalizeBody(
      req.body as Record<string, unknown>
    );

    const parsed = createConsultationSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const consultation = await Consultation.create({
      ...parsed.data,
      status: "NEW",
    });

    await sendConsultationNotification({
      name: consultation.name,
      email: consultation.email,
      phone: consultation.phone,
      consultationType: consultation.consultationType,
      preferredDate: consultation.preferredDate
        ? consultation.preferredDate.toISOString().split("T")[0]
        : undefined,
      preferredTime: consultation.preferredTime,
      location: consultation.location,
      message: consultation.message,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Consultation request submitted successfully",
      data: consultation,
    });
  });

// Admin: list consultation requests
export const listAdminConsultationsController =
  asyncHandler(async (req: Request, res: Response) => {
    const parsed = consultationQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Invalid consultation query",
        parsed.error.flatten()
      );
    }

    const { page, limit, status, consultationType } =
      parsed.data;

    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (consultationType) {
      filter.consultationType = consultationType;
    }

    const [consultations, total] = await Promise.all([
      Consultation.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Consultation.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      message: "Consultations fetched successfully",
      data: {
        consultations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  });

// Admin: get one consultation
export const getAdminConsultationController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      throw new ApiError(404, "Consultation not found");
    }

    return sendSuccess(res, {
      message: "Consultation fetched successfully",
      data: consultation,
    });
  });

// Admin: update consultation details or status
export const updateConsultationController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const body = normalizeBody(
      req.body as Record<string, unknown>
    );

    const parsed = updateConsultationSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        "Validation failed",
        parsed.error.flatten()
      );
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      throw new ApiError(404, "Consultation not found");
    }

    return sendSuccess(res, {
      message: "Consultation updated successfully",
      data: consultation,
    });
  });

// Admin: delete consultation
export const deleteConsultationController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    validateId(id);

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      throw new ApiError(404, "Consultation not found");
    }

    return sendSuccess(res, {
      message: "Consultation deleted successfully",
      data: consultation,
    });
  });

