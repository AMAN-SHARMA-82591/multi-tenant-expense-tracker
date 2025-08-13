import express from "express";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import { z } from "zod/v4";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  const { success, data, error } = registerSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  try {
    const { username, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 12);
    const tenantId = crypto.randomUUID();
    const userData = await UserModel.findOne({ email });
    if (userData) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    await UserModel.create({
      username,
      email,
      password: hashPassword,
      tenantId,
    });
    const token = jwt.sign({ tenantId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered.", token });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error.");
  }
});

router.post("/sign-in", async (req, res) => {
  const { success, data, error } = loginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  try {
    const { email, password } = data;
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordVaild = await bcrypt.compare(password, userData.password);
    if (!isPasswordVaild) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { tenantId: userData.tenantId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "User logged in.", token });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error.");
  }
});

export default router;
