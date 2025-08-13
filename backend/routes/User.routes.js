import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.end("Users list");
});
export default router;
