import { model, Schema } from "mongoose";

const ExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [1, "Category must be at least 1 character"],
      maxlength: [100, "Category must be at most 100 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (val) {
          const parsed = new Date(val);
          const now = new Date();
          return (
            !isNaN(parsed.getTime()) &&
            parsed > new Date("2025-01-01") &&
            parsed < now
          );
        },
        message: "Date must be between January 1, 2025 and today",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
      max: [1000000, "Amount must be less than $1,00,000"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy is required"],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant ID is required"],
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

ExpenseSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.tenantId;
    delete ret.__v;
    return ret;
  },
});

const ExpenseModel = model("Expense", ExpenseSchema);
export default ExpenseModel;
