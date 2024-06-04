import express from "express";
import {
	getFriends,
	getSearchedFriends,
	removeFriend,
	directRemoveFriend,
	getRandomFriends,
	getSearchedRandomFriends,
	loadSearchedRandomFriends,
	getIsFriend,
} from "../controllers/friend.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-friends", verifyToken, getFriends);
router.get("/get-searched-friends", verifyToken, getSearchedFriends);
router.delete("/remove-friend", verifyToken, removeFriend);
router.delete("/direct-remove-friend", verifyToken, directRemoveFriend);
router.get("/get-random-friends", verifyToken, getRandomFriends);
router.get(
	"/get-searched-random-friends",
	verifyToken,
	getSearchedRandomFriends
);
router.get(
	"/load-searched-random-friends",
	verifyToken,
	loadSearchedRandomFriends
);
router.get("/get-is-friend", verifyToken, getIsFriend);

export default router;
