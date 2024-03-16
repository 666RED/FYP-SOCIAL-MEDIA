import express from "express";
import { getUserGroups, getDiscoverGroups } from "../controllers/group.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-user-groups", verifyToken, getUserGroups);
router.get("/get-discover-groups", verifyToken, getDiscoverGroups);

export default router;
