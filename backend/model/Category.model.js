import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    strict: true,
  }
);

const CategoryModel = model("Category", CategorySchema);
export default CategoryModel;
