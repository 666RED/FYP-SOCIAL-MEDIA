import express from "express";
import {
	updatePersonalInfo,
	verifyOldPassword,
	changePassword,
	applyFrame,
} from "../controllers/setting.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.patch("/update-personal-info", verifyToken, updatePersonalInfo);
router.post("/verify-old-password", verifyToken, verifyOldPassword);
router.patch("/change-password", verifyToken, changePassword);
router.patch("/apply-frame", verifyToken, applyFrame);

export default router;
