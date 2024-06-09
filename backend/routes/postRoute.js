import express from "express";
import {
	getPosts,
	getPost,
	upLikes,
	downLikes,
	deletePost,
	getHomePosts,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-posts", verifyToken, getPosts);
router.get("/get-post", verifyToken, getPost);
router.patch("/up-likes", verifyToken, upLikes);
router.patch("/down-likes", verifyToken, downLikes);
router.delete("/delete-post", verifyToken, deletePost);
router.get("/get-home-posts", verifyToken, getHomePosts);

export default router;
