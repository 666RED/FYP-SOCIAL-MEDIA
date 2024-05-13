import mongoose from "mongoose";

const joinGroupRequestSchema = mongoose.Schema(
	{
		requestorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Group",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export const JoinGroupRequest = mongoose.model(
	"JoinGroupRequest",
	joinGroupRequestSchema
);
