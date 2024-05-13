import mongoose from "mongoose";

const groupPostCommentSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		groupPostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "GroupPost",
			required: true,
		},
		commentDescription: {
			type: String,
			required: true,
			min: 1,
			max: 200,
		},
		commentTime: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const GroupPostComment = mongoose.model(
	"GroupPostComment",
	groupPostCommentSchema
);
