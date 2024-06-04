import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		commentDescription: {
			type: String,
			required: true,
			min: 1,
			max: 200,
		},
	},
	{
		timestamps: true,
	}
);

export const Comment = mongoose.model("Comment", commentSchema);
