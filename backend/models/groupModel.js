import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
	{
		groupName: {
			type: String,
			required: true,
			min: 3,
			max: 50,
		},
		groupImagePath: {
			type: String,
			default: "default-group-image.png",
		},
		groupCoverImagePath: {
			type: String,
			default: "default-group-cover-image.jpg",
		},
		groupBio: {
			type: String,
			default: "",
			max: 200,
		},
		groupAdminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		members: {
			type: Map,
			of: Boolean,
			default: new Map(),
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

export const Group = mongoose.model("Group", groupSchema);
