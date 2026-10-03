import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
  }),

  params: z.object({}),

  query: z.object({}),
});