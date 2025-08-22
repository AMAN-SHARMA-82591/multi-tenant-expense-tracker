import { z } from "zod/v4";

// title, category, amount, date
export const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title is required")
    .max(100, "Title must be at most 100 characters"),

  category: z
    .string()
    .trim()
    .min(3, "Category is required")
    .max(100, "Category must be at most 100 characters"),

  amount: z
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .min(1, "Amount must be greater than 0")
    .max(100000, "Amount must be less than $1,00,000"),

  date: z.string().refine(
    (val) => {
      const parsed = new Date(val);
      const now = new Date();

      return (
        !isNaN(parsed.getTime()) &&
        parsed >= new Date("2025-01-01") &&
        parsed < now
      );
    },
    {
      message: "Date must be between January 1, 2025 and today",
    }
  ),
});
