import express from "express";
import cors from "cors";
import authRoute from "./routes/Authentication.routes.js";
import userRoute from "./routes/User.routes.js";
import expenseRoute from "./routes/Expense.routes.js";
import connectDB from "./config/db.js";
import "dotenv/config";
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/expense", expenseRoute);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    return;
  }
};

start();
