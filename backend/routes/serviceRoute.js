import express from "express";
import {
	getServices,
	getService,
	getSearchedServices,
	getMyServices,
	getSearchedMyServices,
	removeService,
} from "../controllers/service.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-services", verifyToken, getServices);
router.get("/get-service", verifyToken, getService);
router.get("/get-searched-services", verifyToken, getSearchedServices);
router.get("/get-my-services", verifyToken, getMyServices);
router.get("/get-searched-my-services", verifyToken, getSearchedMyServices);
router.patch("/remove-service", verifyToken, removeService);

export default router;
