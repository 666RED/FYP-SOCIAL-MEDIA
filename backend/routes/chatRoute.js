import express from "express";
import {
	retrieveUser,
	getChatsProfile,
	updateViewed,
} from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/retrieve-user", verifyToken, retrieveUser);
router.get("/get-chats-profile", getChatsProfile);
router.patch("/update-viewed", updateViewed);

export default router;
