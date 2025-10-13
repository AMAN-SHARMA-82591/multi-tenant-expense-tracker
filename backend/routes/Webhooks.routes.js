import express from "express";

const router = express.Router();

router.post("/push", (req, res) => {
  console.log("Data", req.body);
  return res.sendStatus(201);
});

export default router;
