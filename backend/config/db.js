import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("autoCreate", false);
  return mongoose.connect(url);
};

export default connectDB;
