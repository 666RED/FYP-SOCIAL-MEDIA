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
			type: Map,
			of: Boolean,
			default: new Map(),
		},
		postDescription: {
			type: String,
			max: 2000,
		},
		postImagePath: {
			type: String,
			default: "",
		},
		removed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export const Post = mongoose.model("Post", postSchema);
