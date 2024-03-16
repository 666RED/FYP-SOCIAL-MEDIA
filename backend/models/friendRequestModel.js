import mongoose from "mongoose";

const friendRequestSchema = mongoose.Schema(
	{
		requestorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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

export const FriendRequest = mongoose.model(
	"FriendRequest",
	friendRequestSchema
);
