import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
	{
		filePath: {
			type: String,
		},
		folderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Folder",
			required: true,
		},
		noteOriginalName: {
			type: "String",
			default: "",
		},
	},
	{ timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
