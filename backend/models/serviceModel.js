import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	serviceName: {
		type: String,
		required: true,
		min: 3,
		max: 50,
	},
	serviceDescription: {
		type: String,
		required: true,
		min: 1,
		max: 200,
	},
	serviceCategory: {
		type: String,
		required: true,
	},
	servicePosterImagePath: {
		type: String,
		default: "",
		required: true,
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
});

export const Service = mongoose.model("Service", serviceSchema);
