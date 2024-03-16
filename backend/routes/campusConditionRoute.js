import express from "express";
import {
	getCampusConditions,
	getUserInfo,
	handleUp,
	cancelUp,
	handleDown,
	cancelDown,
	deleteCondition,
	updateConditionResolved,
	getMostUsefulConditions,
	getMostUsefulCondition,
} from "../controllers/campusCondition.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/get-campus-conditions", verifyToken, getCampusConditions);
router.post("/get-user-info", verifyToken, getUserInfo);
router.patch("/handle-up", verifyToken, handleUp);
router.patch("/cancel-up", verifyToken, cancelUp);
router.patch("/handle-down", verifyToken, handleDown);
router.patch("/cancel-down", verifyToken, cancelDown);
router.delete("/delete-condition", verifyToken, deleteCondition);
router.patch(
	"/update-condition-resolved",
	verifyToken,
	updateConditionResolved
);
router.get("/get-most-useful-conditions", verifyToken, getMostUsefulConditions);
router.get("/get-most-useful-condition", verifyToken, getMostUsefulCondition);

export default router;
