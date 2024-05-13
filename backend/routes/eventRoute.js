import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
	getEvents,
	getMyEvents,
	getSearchedEvents,
	getSearchedMyEvents,
	getEvent,
	removeEvent,
} from "../controllers/event.js";

const router = express.Router();

router.get("/get-events", verifyToken, getEvents);
router.get("/get-event", verifyToken, getEvent);
router.get("/get-my-events", verifyToken, getMyEvents);
router.get("/get-searched-events", verifyToken, getSearchedEvents);
router.get("/get-searched-my-events", verifyToken, getSearchedMyEvents);
router.patch("/remove-event", verifyToken, removeEvent);

export default router;
