import express from "express";
import cors from "cors";
import authRoute from "./routes/Authentication.routes.js";
import userRoute from "./routes/User.routes.js";

const app = express();

app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

app.listen(5000, () => {
  console.log("Server is running.");
});
