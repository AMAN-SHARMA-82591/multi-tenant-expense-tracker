import { z } from "zod/v4";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import UserModel from "../model/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import TenantModel from "../model/Tenant.model.js";
import { customTenantDescription } from "../utils/constants.js";

export const signUp = asyncHandler(async (req, res) => {
  const { success, data, error } = registerSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  const { username, email, password } = data;
  const hashPassword = await bcrypt.hash(password, 12);
  const existingUser = await UserModel.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError("User with this email already exists", 409);
    } else if (existingUser.username === username) {
      throw new ApiError("User with this username already exists", 409);
    }
  }

  const user = await UserModel.create({
    username,
    email,
    password: hashPassword,
  });

  const personalTenant = await TenantModel.create({
    name: username,
    userId: user._id,
    description: customTenantDescription,
    type: "personal",
  });

  user.tenantId = personalTenant._id;
  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      username,
      email,
      role: user.role,
      tenantId: personalTenant._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return res
    .status(201)
    .json({ success: true, message: "User registered.", token });
});

export const signIn = asyncHandler(async (req, res) => {
  const { success, data, error } = loginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }
  const { email, password } = data;
  const userData = await UserModel.findOne({ email });
  if (!userData)
    throw new ApiError(`No user found with this email: ${email}`, 404);
  const isPasswordVaild = await bcrypt.compare(password, userData.password);
  if (!isPasswordVaild) throw new ApiError("Invalid credentials", 404);
  const token = jwt.sign(
    {
      id: userData._id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
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
