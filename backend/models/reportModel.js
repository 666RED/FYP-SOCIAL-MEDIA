import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
	{
		reporterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		targetId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		reportType: {
			type: String,
			required: true,
			enum: [
				"Post",
				"Group",
				"Group Post",
				"Condition",
				"Product",
				"Service",
				"Event",
			],
		},
		reason: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			default: "Pending",
			enum: ["Pending", "Dismissed", "Removed"],
		},
	},
	{ timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
