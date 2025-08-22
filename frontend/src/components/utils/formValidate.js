import * as yup from "yup";

export const registerSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

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
