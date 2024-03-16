import express from "express";
import {
	addComment,
	deleteComment,
	getComments,
	getComment,
	editComment,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-comments", verifyToken, getComments);
router.post("/add-comment", verifyToken, addComment);
router.delete("/delete-comment", verifyToken, deleteComment);
router.get("/get-comment", verifyToken, getComment);
router.patch("/edit-comment", verifyToken, editComment);

export default router;
