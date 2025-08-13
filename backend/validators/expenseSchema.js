import { z } from "zod/v4";

export const expenseSchema = z.object({
  title: z.string(),
  category: z.string(),
  amount: z.number(),
  date: z.iso.datetime("Date should be in an ISO format."),
});
// title, category, amount, date
