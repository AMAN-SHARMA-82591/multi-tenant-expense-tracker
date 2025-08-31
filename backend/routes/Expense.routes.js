import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import {
  createExpense,
  generateSummaryReport,
  getExpenseList,
} from "../controllers/Expense.controller.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", getExpenseList);

router.get("/generate-report", generateSummaryReport);

router.post("/", createExpense);

export default router;
