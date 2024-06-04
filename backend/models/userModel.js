import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			min: 3,
			max: 50,
		},
		userGender: {
			type: String,
			required: true,
			min: 4, // Male
			max: 6, // emale
		},
		userEmailAddress: {
			type: String,
			required: true,
			unique: true,
			min: 20,
			max: 50,
		},
		userPhoneNumber: {
			type: String,
			required: true,
			unique: true,
			min: 9,
			max: 11,
		},
		userPassword: {
			type: String,
			required: true,
			min: 8,
			max: 30,
		},
		verificationCode: {
			type: String,
			min: 6,
			max: 6,
			default: "",
		},
		userFriendsMap: {
			type: Map,
			default: {},
		},
		userProfile: {
			profileImagePath: {
				type: String,
				default: "default-profile-image.png",
			},
			profileCoverImagePath: {
				type: String,
				default: "default-cover-image.jpg",
			},
			profileBio: {
				type: String,
				max: 200,
				default: "",
			},
			profileFrameColor: {
				type: String,
				required: true,
				default: "none",
			},
		},
		groups: {
			type: Map,
			of: Boolean,
			default: new Map(),
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);
