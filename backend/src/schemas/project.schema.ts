import { z } from "zod";

const jsonArray = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return value;
      }
    }
    return value;
  },
  z.array(z.string().trim().min(1)).default([])
);

const booleanField = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean()
);

const optionalString = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === ""
      ? undefined
      : value,
  z.string().trim().max(200).optional()
);

export const createProjectSchema = z.object({
  title: z.string().trim().min(3).max(150),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens"
    ),

  description: z.string().trim().min(10),

  location: optionalString,
  category: optionalString,
  style: optionalString,

  materials: jsonArray,

  featured: booleanField.default(false),
  published: booleanField.default(false),
});

export const updateProjectSchema =
  createProjectSchema.partial();

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(12),

  category: z.string().trim().optional(),
  style: z.string().trim().optional(),

  featured: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  published: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  search: z.string().trim().optional(),
});

export type CreateProjectInput =
  z.infer<typeof createProjectSchema>;

export type UpdateProjectInput =
  z.infer<typeof updateProjectSchema>;

export type ProjectQueryInput =
  z.infer<typeof projectQuerySchema>;