import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	addGroupPostComment,
	getComments,
	editComment,
	deleteComment,
} from "../controllers/groupPostComment.js";

const router = express.Router();

router.post("/add-group-post-comment", verifyToken, addGroupPostComment);
router.get("/get-comments", verifyToken, getComments);
router.patch("/edit-comment", verifyToken, editComment);
router.delete("/delete-comment", verifyToken, deleteComment);

export default router;
