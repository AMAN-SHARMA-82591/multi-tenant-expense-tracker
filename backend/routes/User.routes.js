import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  authenticationMiddleware,
  asyncHandler(async (req, res) => {
    return res.status(200).json({ users: [] });
  })
);
export default router;
