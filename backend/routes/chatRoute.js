import express from "express";
import {
	retrieveUser,
	sendMessage,
	getChatsProfile,
	updateViewed,
} from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/retrieve-user", verifyToken, retrieveUser);
router.post("/send-message", verifyToken, sendMessage);
router.get("/get-chats-profile", getChatsProfile);
router.patch("/update-viewed", verifyToken, updateViewed);

export default router;
