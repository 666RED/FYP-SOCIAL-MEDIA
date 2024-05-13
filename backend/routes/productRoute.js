import express from "express";
import {
	getProduct,
	getProducts,
	getMyProducts,
	removeProduct,
	getSearchedProducts,
	getSearchedMyProducts,
} from "../controllers/product.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-product", verifyToken, getProduct);
router.get("/get-products", verifyToken, getProducts);
router.get("/get-my-products", verifyToken, getMyProducts);
router.patch("/remove-product", verifyToken, removeProduct);
router.get("/get-searched-products", verifyToken, getSearchedProducts);
router.get("/get-searched-my-products", verifyToken, getSearchedMyProducts);

export default router;
