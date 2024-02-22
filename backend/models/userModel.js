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
		userProfile: {
			profileImagePath: {
				type: String,
				default: "",
			},
			profileCoverImagePath: {
				type: String,
				default: "",
			},
			profileBio: {
				type: String,
				// maybe will be changed later
				max: 200,
				default: "",
			},
			profileFrameColor: {
				type: String,
				required: true,
				default: "default",
			},
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);
