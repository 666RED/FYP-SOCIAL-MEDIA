import express from "express";
import {
	makeReport,
	login,
	register,
	retriveData,
	retrieveUsers,
	searchUsers,
	retrieveGroups,
	searchGroups,
	retrieveConditions,
	searchConditions,
	retrieveProducts,
	searchProducts,
	retrieveServices,
	searchServices,
	retrieveEvents,
	searchEvents,
	retrieveReports,
	dismissReport,
	removeReport,
} from "../controllers/admin.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/make-report", verifyToken, makeReport);
router.post("/login", login);
router.post("/register", register);
router.get("/retrieve-data", verifyToken, retriveData);
router.get("/retrieve-users", verifyToken, retrieveUsers);
router.get("/search-users", verifyToken, searchUsers);
router.get("/retrieve-groups", verifyToken, retrieveGroups);
router.get("/search-groups", verifyToken, searchGroups);
router.get("/retrieve-conditions", verifyToken, retrieveConditions);
router.get("/search-conditions", verifyToken, searchConditions);
router.get("/retrieve-products", verifyToken, retrieveProducts);
router.get("/search-products", verifyToken, searchProducts);
router.get("/retrieve-services", verifyToken, retrieveServices);
router.get("/search-services", verifyToken, searchServices);
router.get("/retrieve-events", verifyToken, retrieveEvents);
router.get("/search-events", verifyToken, searchEvents);
router.get("/retrieve-reports", verifyToken, retrieveReports);
router.patch("/dismiss-report", verifyToken, dismissReport);
router.patch("/remove-report", verifyToken, removeReport);

export default router;
