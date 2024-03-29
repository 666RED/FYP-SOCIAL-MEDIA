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
		likesMap: {
			type: Map, // more efficient than using array to store the user ids
			of: Boolean,
			default: new Map(),
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
