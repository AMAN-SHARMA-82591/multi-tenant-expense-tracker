import { z } from "zod/v4";

export const tenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Title is required")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string()
    .trim()
    .min(3, "Description is required")
    .max(1000, "Description must be at most 100 characters"),
});

export const tenantUserInviteSchema = z.object({
  targetUserEmail: z.email("Please enter a valid email"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(1000, "Title must be at most 100 characters"),
  message: z
    .string()
    .trim()
    .min(3, "Message must be at least 3 characters")
    .max(1000, "Message must be at most 100 characters"),
});

export const inviteResponseSchema = z.object({
  responseType: z.enum(["accepted", "rejected"]),
});
