
import { z } from "zod";

/* =========================================================
   Settings Fields
========================================================= */

const settingsFields = {
  businessName: z
    .string()
    .trim()
    .min(
      2,
      "Business name must be at least 2 characters"
    )
    .max(
      150,
      "Business name cannot exceed 150 characters"
    ),

  businessEmail: z
    .string()
    .trim()
    .email("Business email must be a valid email address"),

  businessWhatsApp: z
    .string()
    .trim()
    .min(
      5,
      "WhatsApp number is required"
    )
    .max(
      30,
      "WhatsApp number cannot exceed 30 characters"
    ),

  phone: z
    .string()
    .trim()
    .max(
      30,
      "Phone number cannot exceed 30 characters"
    )
    .optional(),

  address: z
    .string()
    .trim()
    .max(
      500,
      "Address cannot exceed 500 characters"
    )
    .optional(),

  city: z
    .string()
    .trim()
    .max(
      100,
      "City cannot exceed 100 characters"
    )
    .optional(),

  state: z
    .string()
    .trim()
    .max(
      100,
      "State cannot exceed 100 characters"
    )
    .optional(),

  country: z
    .string()
    .trim()
    .max(
      100,
      "Country cannot exceed 100 characters"
    )
    .default("India"),

  googleMapsUrl: z
    .string()
    .trim()
    .url("Google Maps URL must be valid")
    .optional(),

  instagramUrl: z
    .string()
    .trim()
    .url("Instagram URL must be valid")
    .optional(),

  facebookUrl: z
    .string()
    .trim()
    .url("Facebook URL must be valid")
    .optional(),

  telegramUrl: z
    .string()
    .trim()
    .url("Telegram URL must be valid")
    .optional(),

  officeLatitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),

  officeLongitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
};

/* =========================================================
   Create Settings Schema
========================================================= */

export const createSettingsSchema = z.object(
  settingsFields
);

/* =========================================================
   Update Settings Schema
========================================================= */

export const updateSettingsSchema = z
  .object(settingsFields)
  .partial();

/* =========================================================
   Types
========================================================= */

export type CreateSettingsInput = z.infer<
  typeof createSettingsSchema
>;

export type UpdateSettingsInput = z.infer<
  typeof updateSettingsSchema
>;

