import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticationMiddleware, (req, res) => {
  return res.end("Users List");
});
export default router;
