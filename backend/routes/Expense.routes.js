import express from "express";
import { z } from "zod/v4";
import ApiError from "../utils/apiError.js";
import { YEAR } from "../utils/constants.js";
import asyncHandler from "../utils/asyncHandler.js";
import ExpenseModel from "../model/Expense.model.js";
import { generateAISummary } from "../config/geminiAi.js";
import buildExpenseSummaryPrompt from "../utils/aiPrompt.js";
import { expenseSchema } from "../validators/expenseSchema.js";
import authenticationMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tenantId = req.tenantId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [result] = await ExpenseModel.aggregate([
      { $match: { tenantId } },
      {
        $facet: {
          expenses: [
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);
    const expenseList = result.expenses;
    const total = result.total[0]?.count || 0;
    res.status(200).json({
      success: true,
      message: "Expense list",
      data: {
        expenseList,
        total,
      },
    });
  })
);

router.get("/generate-report", async (req, res) => {
  const tenantId = req.tenantId;
  const monthParam = Number(req.query.month);

  if (isNaN(monthParam) || monthParam < 1 || monthParam > 12) {
    throw new ApiError("Month must be between 1 and 12", 400);
  }

  const startDate = new Date(YEAR, monthParam - 1, 1);
  const endDate = new Date(YEAR, monthParam, 0);

  const [report] = await ExpenseModel.aggregate([
    {
      $match: {
        tenantId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $group: {
        _id: null,
        totalSpend: { $sum: "$total" },
        topCategory: { $first: "$_id" },
        topCategorySpend: { $first: "$total" },
        categories: {
          $push: {
            category: "$_id",
            spend: "$total",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalSpend: 1,
        topCategory: 1,
        topCategorySpend: 1,
        categories: 1,
      },
    },
  ]);
  if (!report) {
    return res.status(200).json({
      success: true,
      report: null,
      message: "No expenses found for this month.",
    });
  }

  const generatedSummaryPrompt = buildExpenseSummaryPrompt(report);
  const reportSummary = await generateAISummary(generatedSummaryPrompt);

  return res.status(200).json({ success: true, report: reportSummary });
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { success, data, error } = expenseSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: z.flattenError(error).fieldErrors });
    }
    const { title, category, amount, date } = data;

    const duplicateExpense = await ExpenseModel.findOne({
      title,
      date,
      tenantId: req.tenantId,
    });
    if (duplicateExpense) {
      throw new ApiError(
        "Expense already exists for this date and title.",
        409
      );
    }

    const expenseData = await ExpenseModel.create({
      title,
      category,
      amount,
      date,
      tenantId: req.tenantId,
    });
    return res.status(201).json({
      success: true,
      message: "New Expense created.",
      data: expenseData,
    });
  })
);

export default router;
