import express from "express";
import {
	getUserGroups,
	getDiscoverGroups,
	getUserGroupsSearch,
	getDiscoverGroupsSearch,
	getGroup,
	getMembers,
	removeMember,
	getSearchedMembers,
	leaveGroup,
	getGroupInfo,
	getGroupAdminId,
	getMemberStatus,
} from "../controllers/group.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-user-groups", verifyToken, getUserGroups);
router.get("/get-user-groups-search", verifyToken, getUserGroupsSearch);
router.get("/get-discover-groups", verifyToken, getDiscoverGroups);
router.get("/get-discover-groups-search", verifyToken, getDiscoverGroupsSearch);
router.get("/get-group", verifyToken, getGroup);
router.get("/get-members", verifyToken, getMembers);
router.patch("/remove-member", verifyToken, removeMember);
router.get("/get-searched-members", verifyToken, getSearchedMembers);
router.patch("/leave-group", verifyToken, leaveGroup);
router.get("/get-group-info", verifyToken, getGroupInfo);
router.get("/get-group-admin-id", verifyToken, getGroupAdminId);
router.get("/get-member-status", verifyToken, getMemberStatus);

export default router;
