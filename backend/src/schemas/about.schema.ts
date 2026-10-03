import { z } from "zod";

/* =========================================================
   Helpers
========================================================= */

const imageUrl = z
  .string()
  .trim()
  .url("Image must be a valid URL")
  .optional();

const imageUrls = z.preprocess(
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

      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Continue with comma-separated values.
      }

      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value;
  },
  z
    .array(
      z
        .string()
        .trim()
        .url("Image must be a valid URL")
    )
    .default([])
);

/* =========================================================
   About Section
========================================================= */

const aboutSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      3,
      "Section title must be at least 3 characters"
    )
    .max(
      150,
      "Section title cannot exceed 150 characters"
    ),

  description: z
    .string()
    .trim()
    .min(
      10,
      "Section description must be at least 10 characters"
    )
    .max(
      5000,
      "Section description cannot exceed 5000 characters"
    ),

  order: z
    .number()
    .int()
    .min(0)
    .default(0),
});

/* =========================================================
   Hero
========================================================= */

const heroSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  subtitle: z
    .string()
    .trim()
    .min(3)
    .max(500),

  image: imageUrl,
});

/* =========================================================
   Studio Story
========================================================= */

const studioStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),

  image: imageUrl,
});

/* =========================================================
   Philosophy
========================================================= */

const philosophySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),
});

/* =========================================================
   Design Language
========================================================= */

const designLanguageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),

  images: imageUrls,
});

/* =========================================================
   CTA
========================================================= */

const ctaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  description: z
    .string()
    .trim()
    .min(10)
    .max(1000),

  buttonText: z
    .string()
    .trim()
    .min(2)
    .max(100),
});

/* =========================================================
   Create About Schema
========================================================= */

export const createAboutSchema = z.object({
  hero: heroSchema,

  studioStory: studioStorySchema,

  philosophy: philosophySchema,

  principles: z
    .array(aboutSectionSchema)
    .default([]),

  approach: z
    .array(aboutSectionSchema)
    .default([]),

  designLanguage: designLanguageSchema,

  cta: ctaSchema,

  published: z
    .boolean()
    .default(false),
});

/* =========================================================
   Update About Schema
========================================================= */

export const updateAboutSchema =
  createAboutSchema.partial();

/* =========================================================
   Types
========================================================= */

export type CreateAboutInput = z.infer<
  typeof createAboutSchema
>;

export type UpdateAboutInput = z.infer<
  typeof updateAboutSchema
>;