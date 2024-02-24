import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		postLikes: {
			type: Number,
			default: 0,
		},
		postComments: {
			type: Number,
			default: 0,
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		postTime: {
			type: String,
			required: true,
		},
		postDescription: {
			type: String,
			max: 2000,
		},
		postImagePath: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

export const Post = mongoose.model("Post", postSchema);
