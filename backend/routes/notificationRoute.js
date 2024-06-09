import express from "express";
import {
	getNotificationsProfile,
	updateViewed,
} from "../controllers/notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-notifications-profile", verifyToken, getNotificationsProfile);
router.patch("/update-viewed", verifyToken, updateViewed);

export default router;
