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
				default:
					"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/profile%2F1717595482346-default-profile-image.png?alt=media&token=b8145895-9bf3-47f7-8092-0a003eda3282",
			},
			profileCoverImagePath: {
				type: String,
				default:
					"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/profile%2F1717595482778-default-cover-image.jpg?alt=media&token=0e92b9db-e471-4bba-bcd5-02821c17bf75",
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
		confirmed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);
