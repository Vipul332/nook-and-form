import { z } from "zod";

const publishedSchema = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

export const createTestimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().max(100).optional(),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(5).max(1000),
  imageUrl: z.string().trim().url().optional(),
  published: publishedSchema.default(false),
});

export const updateTestimonialSchema =
  createTestimonialSchema.partial();

export const testimonialQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  published: z.enum(["true", "false"]).optional(),
});

export type CreateTestimonialInput = z.infer<
  typeof createTestimonialSchema
>;

export type UpdateTestimonialInput = z.infer<
  typeof updateTestimonialSchema
>;