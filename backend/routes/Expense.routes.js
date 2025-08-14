import express from "express";
import { z } from "zod/v4";
import ExpenseModel from "../model/Expense.model.js";
import { expenseSchema } from "../validators/expenseSchema.js";
import authenticationMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", async (req, res) => {
  const tenantId = req.tenantId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error.");
  }
});

router.post("/", async (req, res) => {
  const { success, data, error } = expenseSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  try {
    const { title, category, amount, date } = data;
    // const isCategoryExists = CategoryModel.findOne({ title: category });
    // if (!isCategoryExists) {
    //   await CategoryModel.create({
    //     title: category,
    //     description: null,
    //   });
    // }

    const expenseData = await ExpenseModel.create({
      title,
      category,
      amount,
      date,
      tenantId: req.tenantId,
    });
    res.status(201).json({
      success: true,
      message: "New Expense created.",
      data: expenseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error.");
  }
});

export default router;
