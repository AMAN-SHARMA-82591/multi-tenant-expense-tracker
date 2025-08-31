import { Schema, model } from "mongoose";

const TenantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [1, "Description must be at least 1 character"],
      maxlength: [1000, "Description must be at most 1000 characters"],
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const TenantModel = model("Tenant", TenantSchema);
export default TenantModel;
