import mongoose from "mongoose";

const productSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		productName: {
			type: String,
			required: true,
			min: 3,
			max: 50,
		},
		productDescription: {
			type: String,
			required: true,
			min: 1,
			max: 200,
		},
		productImagePath: {
			type: String,
			default: "",
			required: true,
		},
		productPrice: {
			type: Number,
			required: true,
			min: 0.01,
			max: 10000,
		},
		productQuantity: {
			type: Number,
			required: true,
			min: 1,
			max: 1000,
		},
		contactNumber: {
			type: String,
			required: true,
			min: 9,
			max: 11,
		},
		removed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
