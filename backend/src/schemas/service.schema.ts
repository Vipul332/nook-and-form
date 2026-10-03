import { z } from "zod";

/* =========================================================
   Helpers for multipart/form-data
========================================================= */

const multipartArray = z.preprocess(
  (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) {
        return [];
      }

      /*
       * JSON array
       *
       * Example:
       * '["Modular Kitchen","Custom Cabinets"]'
       */
      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Not JSON, continue with comma-separated format.
      }

      /*
       * Comma-separated format
       *
       * Example:
       * "Modular Kitchen,Custom Cabinets"
       */
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value;
  },
  z
    .array(z.string().trim().min(1))
    .default([])
);

/* =========================================================
   Multipart number
========================================================= */

const multipartNumber = z.preprocess(
  (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return undefined;
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) {
        return undefined;
      }

      const parsed = Number(trimmed);

      return Number.isNaN(parsed) ? value : parsed;
    }

    return value;
  },
  z.number().min(0).optional()
);

/* =========================================================
   Multipart boolean
========================================================= */

const multipartBoolean = (
  defaultValue?: boolean
) =>
  z.preprocess(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return defaultValue;
      }

      if (typeof value === "boolean") {
        return value;
      }

      if (typeof value === "string") {
        const normalized = value
          .trim()
          .toLowerCase();

        if (normalized === "true") {
          return true;
        }

        if (normalized === "false") {
          return false;
        }
      }

      return value;
    },
    z.boolean().optional()
  );

/* =========================================================
   Slug
========================================================= */

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(180)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  );

/* =========================================================
   Base Service Fields
========================================================= */

const serviceFields = {
  name: z
    .string()
    .trim()
    .min(3, "Service name must be at least 3 characters")
    .max(
      150,
      "Service name cannot exceed 150 characters"
    ),

  slug: slugSchema,

  description: z
    .string()
    .trim()
    .min(
      10,
      "Description must be at least 10 characters"
    )
    .max(
      5000,
      "Description cannot exceed 5000 characters"
    ),

  shortDescription: z
    .string()
    .trim()
    .max(
      300,
      "Short description cannot exceed 300 characters"
    )
    .optional(),

  image: z
    .string()
    .trim()
    .url("Image must be a valid URL")
    .optional(),

  startingPrice: multipartNumber,

  features: multipartArray,

  status: z
    .enum(["draft", "published"])
    .default("draft"),

  featured: multipartBoolean(false),
};

/* =========================================================
   Create Service Schema
========================================================= */

export const createServiceSchema = z.object(
  serviceFields
);

/* =========================================================
   Update Service Schema
========================================================= */

export const updateServiceSchema = z
  .object(serviceFields)
  .partial();

/* =========================================================
   Service Query Schema
========================================================= */

export const serviceQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  status: z
    .enum(["draft", "published"])
    .optional(),

  featured: z
    .preprocess(
      (value) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return undefined;
        }

        if (typeof value === "boolean") {
          return value;
        }

        if (typeof value === "string") {
          const normalized = value
            .trim()
            .toLowerCase();

          if (normalized === "true") {
            return true;
          }

          if (normalized === "false") {
            return false;
          }
        }

        return value;
      },
      z.boolean().optional()
    ),

  search: z
    .string()
    .trim()
    .optional(),
});

/* =========================================================
   Types
========================================================= */

export type CreateServiceInput = z.infer<
  typeof createServiceSchema
>;

export type UpdateServiceInput = z.infer<
  typeof updateServiceSchema
>;

export type ServiceQueryInput = z.infer<
  typeof serviceQuerySchema
>;