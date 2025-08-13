import { model, Schema } from "mongoose";

const ExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
      match:
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

ExpenseSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.tenantId;
    delete ret.__v;
    return ret;
  }
})

const ExpenseModel = model("Expense", ExpenseSchema);
export default ExpenseModel;
