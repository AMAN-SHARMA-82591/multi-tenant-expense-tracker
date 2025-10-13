import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import { getConversationList } from "../controllers/Conversation.controller.js";

const router = express.Router();

router.use(authenticationMiddleware);

// Get conversation group
router.route("/").get(getConversationList);

export default router;
