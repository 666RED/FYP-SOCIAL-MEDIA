import { User } from "../models/userModel.js";
import path from "path";
import fs from "fs";
import { __dirname } from "../index.js";

export const getUserProfile = async (req, res) => {
	try {
		const { userId } = req.query;

		const userInfo = await User.findById(userId);

		if (!userInfo) {
			return res.status(400).json({ msg: "User not found" });
		}

		delete userInfo.userPassword;

		res.status(200).json({ msg: "Success", userInfo });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editProfile = async (req, res) => {
	try {
		const { userId, userName, bio } = req.body;

		const profileImage = req.files && req.files.profileImage;
		const coverImage = req.files && req.files.coverImage;

		// Get the original user document
		const originalUser = await User.findById(userId);

		// Delete original images if they exist and their names are not default
		if (profileImage) {
			if (
				originalUser.userProfile.profileImagePath !==
					"default-profile-image.png" &&
				originalUser.userProfile.profileImagePath !== profileImage[0].filename
			) {
				const profileImagePath = path.join(
					__dirname,
					"public/images/profile",
					originalUser.userProfile.profileImagePath
				);
				fs.unlinkSync(profileImagePath);
			}
		}

		if (coverImage) {
			if (
				originalUser.userProfile.profileCoverImagePath !==
					"default-cover-image.jpg" &&
				originalUser.userProfile.profileCoverImagePath !==
					coverImage[0].filename
			) {
				const coverImagePath = path.join(
					__dirname,
					"public/images/profile",
					originalUser.userProfile.profileCoverImagePath
				);
				fs.unlinkSync(coverImagePath);
			}
		}

		let user;

		// without updating images
		if (!profileImage && !coverImage) {
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						userName,
						"userProfile.profileBio": bio,
					},
				},
				{ new: true }
			);
		} else if (!profileImage) {
			// only update cover image
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						"userProfile.profileCoverImagePath": coverImage[0].filename,
						userName,
						"userProfile.profileBio": bio,
					},
				},
				{ new: true }
			);
		} else if (!coverImage) {
			// only update profile image
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						"userProfile.profileImagePath": profileImage[0].filename,
						userName,
						"userProfile.profileBio": bio,
					},
				},
				{ new: true }
			);
		} else {
			// update both images
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						"userProfile.profileImagePath": profileImage[0].filename,
						"userProfile.profileCoverImagePath": coverImage[0].filename,
						userName,
						"userProfile.profileBio": bio,
					},
				},
				{ new: true }
			);
		}

		if (!user) {
			return res.status(400).json({ msg: "User not found" });
		}

		res.status(200).json({ msg: "Success", user });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};
