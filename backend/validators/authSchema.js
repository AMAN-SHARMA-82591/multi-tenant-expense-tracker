import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const registerSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, "Name should be at least 3 characters")
    .max(100, "Name can be at max 100 characters"),
});
