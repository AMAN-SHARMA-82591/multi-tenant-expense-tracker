import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: [
        3,
        "Username field should a string with at least three characters",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      minLength: 4,
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
      unique: true,
      match:
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    },
  },
  {
    strict: true,
  }
);

const UserModel = model("User", UserSchema);
export default UserModel;
