import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	createNewFolder,
	retrieveFolders,
	retrieveNotes,
	removeNote,
	removeFolder,
	renameFolder,
} from "../controllers/note.js";

const router = express.Router();

router.post("/create-new-folder", verifyToken, createNewFolder);
router.get("/retrieve-folders", verifyToken, retrieveFolders);
router.get("/retrieve-notes", verifyToken, retrieveNotes);
router.delete("/remove-note", verifyToken, removeNote);
router.delete("/remove-folder", verifyToken, removeFolder);
router.patch("/rename-folder", verifyToken, renameFolder);

export default router;
