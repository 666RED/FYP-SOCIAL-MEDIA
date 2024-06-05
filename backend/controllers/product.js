import mongoose from "mongoose";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { uploadFile, deleteFile } from "../middleware/handleFile.js";

export const createNewProduct = async (req, res) => {
	try {
		const { name, description, price, quantity, userId, contactNumber } =
			req.body;

		const image = req.file;

		const imageURL = await uploadFile("product/", image);

		const newProduct = new Product({
			productName: name,
			productDescription: description,
			productPrice: price,
			productQuantity: quantity,
			productImagePath: imageURL,
			userId,
			contactNumber,
		});

		const savedProduct = await newProduct.save();

		if (!savedProduct) {
			return res.status(400).json({ msg: "Fail to create new product" });
		}

		res.status(201).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getProducts = async (req, res) => {
	try {
		const productIds = JSON.parse(req.query.productIds);

		const products = await Product.aggregate([
			{
				$match: {
					$and: [
						// not equal to userId
						{ removed: false },
						{
							_id: {
								$nin: productIds.map((id) => new mongoose.Types.ObjectId(id)),
							},
						},
					],
				},
			},
			{
				$sample: { size: 15 },
			},
		]);

		if (!products) {
			return res.status(404).json({ msg: "Products not found" });
		}

		const returnProducts = products.map((product) => {
			const { productDescription, __v, removed, ...rest } = product;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnProducts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getProduct = async (req, res) => {
	try {
		const { id } = req.query;
		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ msg: "Product not found" });
		}

		const user = await User.findById(product.userId);

		let userName = "";
		let userProfileImagePath = "";
		let frameColor = "";

		if (user) {
			userName = user.userName;
			userProfileImagePath = user.userProfile.profileImagePath;
			frameColor = user.userProfile.profileFrameColor;
		}

		const { __v, ...rest } = product._doc;

		res.status(200).json({
			msg: "Success",
			product: { ...rest, userName, userProfileImagePath, frameColor },
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMyProducts = async (req, res) => {
	try {
		const { userId } = req.query;

		const productIds = JSON.parse(req.query.productIds);

		const products = await Product.aggregate([
			{
				$match: {
					$and: [
						{ userId: new mongoose.Types.ObjectId(userId) },
						{ removed: false },
						{
							_id: {
								$nin: productIds.map((id) => new mongoose.Types.ObjectId(id)),
							},
						},
					],
				},
			},
			{
				$limit: 15,
			},
		]);

		if (!products) {
			return res.status(404).json({ msg: "Products not found" });
		}

		const returnProducts = products.map((product) => {
			const { productDescription, __v, removed, ...rest } = product;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnProducts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editProduct = async (req, res) => {
	try {
		const { productId, name, description, price, quantity, contactNumber } =
			req.body;

		const image = req.file;

		const originalProduct = await Product.findById(productId);
		const originalProductImagePath = originalProduct.productImagePath;

		let updatedProduct;

		// update image
		if (image) {
			const imageURL = await uploadFile("product/", image);
			updatedProduct = await Product.findByIdAndUpdate(productId, {
				$set: {
					productName: name,
					productDescription: description,
					productPrice: price,
					productQuantity: quantity,
					productImagePath: imageURL,
					contactNumber,
				},
			});
		} else {
			// do not update image
			updatedProduct = await Product.findByIdAndUpdate(productId, {
				$set: {
					productName: name,
					productDescription: description,
					productPrice: price,
					productQuantity: quantity,
					contactNumber,
				},
			});
		}

		if (!updatedProduct) {
			return res.status(400).json({ msg: "Fail to edit product" });
		}

		// remove original image
		if (image) {
			await deleteFile(originalProductImagePath);
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeProduct = async (req, res) => {
	try {
		const { productId } = req.body;

		const removedProduct = await Product.findByIdAndUpdate(productId, {
			$set: { removed: true },
		});

		if (!removedProduct) {
			return res.status(400).json({ msg: "Fail to remove product" });
		}

		// remove image
		await deleteFile(removedProduct.productImagePath);

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedProducts = async (req, res) => {
	try {
		const { searchText } = req.query;
		const limit = 15;
		const productIds = JSON.parse(req.query.productIds);

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const excludedProducts = productIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const products = await Product.aggregate([
			{
				$match: {
					_id: { $nin: excludedProducts },
					removed: false,
					productName: { $regex: searchText, $options: "i" },
				},
			},
			{
				$limit: limit,
			},
		]);

		const returnProducts = products.map((product) => {
			const { productDescription, __v, removed, ...rest } = product;
			return rest;
		});

		if (!returnProducts) {
			return res.status(400).json({ msg: "Fail to retrieve products" });
		}

		res.status(200).json({ msg: "Success", returnProducts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedMyProducts = async (req, res) => {
	try {
		const { userId, searchText } = req.query;
		const limit = 15;
		const productIds = JSON.parse(req.query.productIds);

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const excludedProducts = productIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const products = await Product.aggregate([
			{
				$match: {
					_id: { $nin: excludedProducts },
					userId: new mongoose.Types.ObjectId(userId),
					removed: false,
					productName: { $regex: searchText, $options: "i" },
				},
			},
			{
				$limit: limit,
			},
		]);

		const returnProducts = products.map((product) => {
			const { productDescription, __v, removed, ...rest } = product;
			return rest;
		});

		if (!returnProducts) {
			return res.status(400).json({ msg: "Fail to retrieve products" });
		}

		res.status(200).json({ msg: "Success", returnProducts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
