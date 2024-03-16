import express from "express";
import { getUserProfile, editProfile } from "../controllers/profile.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getUserProfile);
router.post("/edit-profile", verifyToken, editProfile);

export default router;
