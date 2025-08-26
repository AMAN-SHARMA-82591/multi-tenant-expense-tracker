import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoute from "./routes/User.routes.js";
import expenseRoute from "./routes/Expense.routes.js";
import authRoute from "./routes/Authentication.routes.js";
import "dotenv/config";
import socketHandler from "./sockets/index.js";

const app = express();
let server;
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

app.use((err, req, res, next) => {
  console.error(err);
  return res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "Something went wrong." });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    const io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS,
        credentials: true,
      },
    });
    socketHandler(io);
  } catch (error) {
    console.log(error);
    return;
  }
};

start();
export { app, server };
