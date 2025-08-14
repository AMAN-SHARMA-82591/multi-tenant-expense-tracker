import * as yup from "yup";

export const createExpenseSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),

  category: yup
    .string()
    .trim()
    .required("Category is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Category must be at most 100 characters"),

  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .required("Amount is required")
    .min(1, "Amount must be greater than 0")
    .max(100000, "Amount must be at most 100000$"),
  date: yup
    .date()
    .typeError("Invalid date format")
    .required("Date is required")
    .min(new Date("2025-01-01"), "Date cannot be before January 1, 2025")
    .max(new Date(), `Date cannot be after ${new Date().toDateString()}`),
});
