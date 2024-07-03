import express from "express";
import {
	getNotificationsProfile,
	getNotificationProfile,
	updateViewed,
} from "../controllers/notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-notifications-profile", getNotificationsProfile);
router.get("/get-notification-profile", getNotificationProfile);
router.patch("/update-viewed", verifyToken, updateViewed);

export default router;
