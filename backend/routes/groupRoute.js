import express from "express";
import {
	getUserGroups,
	getDiscoverGroups,
	getUserGroupsSearch,
	getDiscoverGroupsSearch,
} from "../controllers/group.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-user-groups", verifyToken, getUserGroups);
router.get("/get-user-groups-search", verifyToken, getUserGroupsSearch);
router.get("/get-discover-groups", verifyToken, getDiscoverGroups);
router.get("/get-discover-groups-search", verifyToken, getDiscoverGroupsSearch);

export default router;
