import { model, Schema } from "mongoose";
import { emailRegex, tenantIdRegex } from "../utils/constants.js";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [100, "Username must be at most 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [emailRegex, "Please enter a valid email"],
      maxlength: [100, "Email must be at most 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
      maxlength: [100, "Password must be at most 100 characters"],
    },
    tenantId: {
      type: String,
      required: [true, "Tenant ID is required"],
      unique: true,
      match: [tenantIdRegex, "Invalid tenant ID format"],
    },
  },
  {
    strict: true,
  }
);

const UserModel = model("User", UserSchema);
export default UserModel;
