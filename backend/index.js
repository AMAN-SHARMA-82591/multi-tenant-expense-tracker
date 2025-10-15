import "dotenv/config";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import socketHandler from "./sockets/index.js";
import routes from "./routes/index.js";

const app = express();
let server;
let socketIo;
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Main Routing
routes(app);

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
    socketIo = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS,
        credentials: true,
      },
    });
    socketHandler(socketIo);
  } catch (error) {
    console.error(error);
    return;
  }
};

start();
export { app, server, socketIo };
