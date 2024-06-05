import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	getGroupPosts,
	upLikes,
	downLikes,
	deletePost,
	getYourGroupPosts,
} from "../controllers/groupPost.js";

const router = express.Router();

router.get("/get-group-posts", verifyToken, getGroupPosts);
router.get("/get-your-group-posts", verifyToken, getYourGroupPosts);
router.patch("/up-likes", verifyToken, upLikes);
router.patch("/down-likes", verifyToken, downLikes);
router.delete("/delete-post", verifyToken, deletePost);

export default router;
