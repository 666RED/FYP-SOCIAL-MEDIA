import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	sendFriendRequest,
	getFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	getFriendRequests,
	getFriendRequestsAmount,
	getPendingFriendRequests,
	getPendingFriendRequestsAmount,
} from "../controllers/friendRequest.js";

const router = express.Router();

router.post("/send-friend-request", verifyToken, sendFriendRequest);
router.get("/get-friend-request", verifyToken, getFriendRequest);
router.delete("/cancel-friend-request", verifyToken, cancelFriendRequest);
router.patch("/accept-friend-request", verifyToken, acceptFriendRequest);
router.delete("/reject-friend-request", verifyToken, rejectFriendRequest);
router.get("/get-friend-requests", verifyToken, getFriendRequests);
router.get(
	"/get-pending-friend-requests",
	verifyToken,
	getPendingFriendRequests
);
router.get("/get-friend-requests-amount", verifyToken, getFriendRequestsAmount);
router.get(
	"/get-pending-friend-requests-amount",
	verifyToken,
	getPendingFriendRequestsAmount
);

export default router;
