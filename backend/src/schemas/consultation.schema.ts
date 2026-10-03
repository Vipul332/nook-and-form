import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ID");

const consultationTypeSchema = z.enum([
  "PHONE",
  "WHATSAPP",
  "ONLINE",
  "OFFICE_VISIT",
  "SITE_VISIT",
]);

const consultationStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
]);

export const createConsultationSchema = z.object({
  name: z.string().trim().min(1).max(100),

  email: z.string().trim().email(),

  phone: z.string().trim().min(7).max(20),

  consultationType: consultationTypeSchema,

  selectedDesignId: objectIdSchema.optional(),

  roomImage: z
    .object({
      url: z.string().trim().url(),
      publicId: z.string().trim().min(1),
    })
    .optional(),

  preferredDate: z.coerce.date().optional(),

  preferredTime: z.string().trim().max(50).optional(),

  location: z.string().trim().max(300).optional(),

  message: z.string().trim().max(2000).optional(),
});

export const updateConsultationSchema = z
  .object({
    consultationType: consultationTypeSchema.optional(),

    selectedDesignId: objectIdSchema.nullable().optional(),

    roomImage: z
      .object({
        url: z.string().trim().url(),
        publicId: z.string().trim().min(1),
      })
      .nullable()
      .optional(),

    preferredDate: z.coerce.date().nullable().optional(),

    preferredTime: z.string().trim().max(50).nullable().optional(),

    location: z.string().trim().max(300).nullable().optional(),

    message: z.string().trim().max(2000).nullable().optional(),

    status: consultationStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const consultationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  status: consultationStatusSchema.optional(),

  consultationType: consultationTypeSchema.optional(),
});

export type CreateConsultationInput = z.infer<
  typeof createConsultationSchema
>;

export type UpdateConsultationInput = z.infer<
  typeof updateConsultationSchema
>;

export type ConsultationQueryInput = z.infer<
  typeof consultationQuerySchema
>;
