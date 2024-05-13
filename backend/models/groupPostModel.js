import mongoose from "mongoose";

const groupPostSchema = mongoose.Schema(
	{
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Group",
			required: true,
		},
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
		postFilePath: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

export const GroupPost = mongoose.model("GroupPost", groupPostSchema);
