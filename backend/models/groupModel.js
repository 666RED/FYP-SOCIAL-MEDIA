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
			default:
				"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/group%2F1717572712982-default-group-image.png?alt=media&token=f477f873-41ee-4f68-ae76-11340d7b595b",
		},
		groupCoverImagePath: {
			type: String,
			default:
				"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/group%2F1717572713265-default-group-cover-image.jpg?alt=media&token=89c92422-f0e5-46e4-b603-9fd7a1ced3ff",
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
