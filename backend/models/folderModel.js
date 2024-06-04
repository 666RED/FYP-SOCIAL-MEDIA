import mongoose, { Types } from "mongoose";

const folderSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 50,
		},
		groupId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Group",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Folder = mongoose.model("Folder", folderSchema);
