import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import { expnseSchema } from "../validators/expenseSchema.js";
import CategoryModel from "../model/Category.model.js";

const router = express.Router();

router.get("/", async (req, res) => {});

router.post("/", async (req, res) => {
  const { success, data, error } = registerSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  try {
    const { title, category, amount, date } = data;
    const isCategoryExists = CategoryModel.findOne({ title: category });
    if (!isCategoryExists) {
      await CategoryModel.create({
        title: category,
        description: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error.");
  }
});

export default router;