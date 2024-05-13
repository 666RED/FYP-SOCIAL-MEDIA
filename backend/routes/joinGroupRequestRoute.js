import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	sendJoinGroupRequest,
	getJoinGroupRequests,
	getJoinGroupRequest,
	cancelJoinGroupRequest,
	acceptJoinGroupRequest,
	rejectJoinGroupRequest,
	getNumberJoinGroupRequests,
} from "../controllers/joinGroupRequest.js";

const router = express.Router();

router.post("/send-join-group-request", verifyToken, sendJoinGroupRequest);
router.get("/get-join-group-requests", verifyToken, getJoinGroupRequests);
router.get("/get-join-group-request", verifyToken, getJoinGroupRequest);
router.delete(
	"/cancel-join-group-request",
	verifyToken,
	cancelJoinGroupRequest
);
router.patch("/accept-join-group-request", verifyToken, acceptJoinGroupRequest);
router.delete(
	"/reject-join-group-request",
	verifyToken,
	rejectJoinGroupRequest
);
router.get(
	"/get-number-join-group-requests",
	verifyToken,
	getNumberJoinGroupRequests
);

export default router;
