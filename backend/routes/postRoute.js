import express from "express";
import { getPosts, upLikes, downLikes } from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/get-posts", verifyToken, getPosts);
router.patch("/up-likes", verifyToken, upLikes);
router.patch("/down-likes", verifyToken, downLikes);

export default router;
