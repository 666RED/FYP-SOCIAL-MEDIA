import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
		min: 1,
		max: 20,
	},
	password: {
		type: String,
		required: true,
		min: 8,
		max: 30,
	},
});

export const Admin = mongoose.model("Admin", adminSchema);
