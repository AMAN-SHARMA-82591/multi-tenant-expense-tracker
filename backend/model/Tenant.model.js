import { Schema, model } from "mongoose";

const tenantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      trim: true,
      required: [true, "Category is required"],
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    strict: true,
    timestamps: true,
  }
);

export default model("Tenant", tenantSchema);
