import { model, Schema } from "mongoose";
import { emailRegex, roles } from "../utils/constants.js";

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
    // tenantId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Tenant",
    //   default: null,
    // },
    role: {
      type: String,
      enum: roles,
      default: "owner",
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);
export default UserModel;
