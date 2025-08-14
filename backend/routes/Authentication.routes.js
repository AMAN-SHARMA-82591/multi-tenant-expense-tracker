import express from "express";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import { z } from "zod/v4";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const router = express.Router();

router.post(
  "/sign-up",
  asyncHandler(async (req, res) => {
    const { success, data, error } = registerSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: z.flattenError(error).fieldErrors });
    }
    const { username, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 12);
    const tenantId = crypto.randomUUID();
    const userData = await UserModel.findOne({ email });
    if (userData) throw new ApiError("User already exists", 409);
    await UserModel.create({
      username,
      email,
      password: hashPassword,
      tenantId,
    });
    const token = jwt.sign(
      { username, email, tenantId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(201)
      .json({ success: true, message: "User registered.", token });
  })
);

router.post("/sign-in", async (req, res) => {
  const { success, data, error } = loginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  const { email, password } = data;
  const userData = await UserModel.findOne({ email });
  if (!userData) throw new ApiError("Invalid credentials", 404);
  const isPasswordVaild = await bcrypt.compare(password, userData.password);
  if (!isPasswordVaild) throw new ApiError("Invalid credentials", 404);
  const token = jwt.sign(
    {
      username: userData.username,
      email: userData.email,
      tenantId: userData.tenantId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return res
    .status(200)
    .json({ success: true, message: "User logged in.", token });
});

export default router;
