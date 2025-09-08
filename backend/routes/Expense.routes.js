import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import {
  createPersonalExpense,
  generateSummaryReport,
  getPersonalExpenseList,
} from "../controllers/Expense.controller.js";

const router = express.Router();

router.use(authenticationMiddleware);

// Get personal expense list
router.get("/", getPersonalExpenseList);

router.get("/generate-report", generateSummaryReport);

router.post("/create", createPersonalExpense);

export default router;
