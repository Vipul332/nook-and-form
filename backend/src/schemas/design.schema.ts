import { z } from "zod";

/* =========================================================
   Helpers for multipart/form-data
========================================================= */

const multipartArray = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === "") {
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
       * Try JSON array first.
       *
       * Example:
       * '["white","black","grey"]'
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
       * Example:
       * "white,black,grey"
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
    if (value === undefined || value === null || value === "") {
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
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  )
  .min(3)
  .max(180);

/* =========================================================
   Base Design Schema
========================================================= */

/*
 * IMPORTANT:
 *
 * Keep this schema WITHOUT .refine().
 *
 * Zod v4 does not allow:
 *
 * object.refine(...).partial()
 *
 * We apply .partial() first for the update schema,
 * and then apply the budget refinement.
 */

const designFields = {
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  slug: slugSchema,

  description: z
    .string()
    .trim()
    .min(
      10,
      "Description must be at least 10 characters"
    ),

  roomType: z
    .string()
    .trim()
    .min(2)
    .max(100),

  style: z
    .string()
    .trim()
    .min(2)
    .max(100),

  colors: multipartArray,

  materials: multipartArray,

  tags: multipartArray,

  budgetMin: multipartNumber,

  budgetMax: multipartNumber,

  aiEnabled: multipartBoolean(true),

  featured: multipartBoolean(false),

  published: multipartBoolean(false),
};

/* =========================================================
   Create Design Schema
========================================================= */

export const createDesignSchema = z
  .object(designFields)
  .refine(
    (data) => {
      if (
        data.budgetMin !== undefined &&
        data.budgetMax !== undefined
      ) {
        return data.budgetMax >= data.budgetMin;
      }

      return true;
    },
    {
      message:
        "Maximum budget must be greater than or equal to minimum budget",
      path: ["budgetMax"],
    }
  );

/* =========================================================
   Update Design Schema
========================================================= */

export const updateDesignSchema = z
  .object(designFields)
  .partial()
  .refine(
    (data) => {
      if (
        data.budgetMin !== undefined &&
        data.budgetMax !== undefined
      ) {
        return data.budgetMax >= data.budgetMin;
      }

      return true;
    },
    {
      message:
        "Maximum budget must be greater than or equal to minimum budget",
      path: ["budgetMax"],
    }
  );

/* =========================================================
   Design Query Schema
========================================================= */

export const designQuerySchema = z.object({
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

  roomType: z
    .string()
    .trim()
    .optional(),

  style: z
    .string()
    .trim()
    .optional(),

  color: z
    .string()
    .trim()
    .optional(),

  material: z
    .string()
    .trim()
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

  published: z
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

  archived: z
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

export type CreateDesignInput = z.infer<
  typeof createDesignSchema
>;

export type UpdateDesignInput = z.infer<
  typeof updateDesignSchema
>;

export type DesignQueryInput = z.infer<
  typeof designQuerySchema
>;