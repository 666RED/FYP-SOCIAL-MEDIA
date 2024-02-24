import express from "express";
import {
	addComment,
	deleteComment,
	getComments,
	getComment,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/get-comments", verifyToken, getComments);
router.post("/add-comment", verifyToken, addComment);
router.delete("/delete-comment", verifyToken, deleteComment);
router.post("/get-comment", verifyToken, getComment);

export default router;
