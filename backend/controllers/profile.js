import { User } from "../models/userModel.js";
import { uploadFile, deleteFile } from "../middleware/handleFile.js";

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
		const originalProfileImagePath = originalUser.userProfile.profileImagePath;
		const originalProfileCoverImagePath =
			originalUser.userProfile.profileCoverImagePath;

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
			const imageURL = await uploadFile("profile/", coverImage[0]);
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						"userProfile.profileCoverImagePath": imageURL,
						userName,
						"userProfile.profileBio": bio,
					},
				},
				{ new: true }
			);
		} else if (!coverImage) {
			// only update profile image
			const imageURL = await uploadFile("profile", profileImage[0]);
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						"userProfile.profileImagePath": imageURL,
						userName,
						"userProfile.profileBio": bio,
					},
				},
				{ new: true }
			);
		} else {
			// update both images
			const profileImageURL = await uploadFile("profile/", profileImage[0]);
			const coverImageURL = await uploadFile("profile/", coverImage[0]);
			user = await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						"userProfile.profileImagePath": profileImageURL,
						"userProfile.profileCoverImagePath": coverImageURL,
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

		// Delete original images if they exist and their names are not default
		if (profileImage) {
			if (
				originalProfileImagePath !==
					"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/profile%2F1717595482346-default-profile-image.png?alt=media&token=b8145895-9bf3-47f7-8092-0a003eda3282" &&
				originalProfileImagePath !== profileImage[0].filename
			) {
				await deleteFile(originalProfileImagePath);
			}
		}

		if (coverImage) {
			if (
				originalProfileCoverImagePath !==
					"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/profile%2F1717595482778-default-cover-image.jpg?alt=media&token=0e92b9db-e471-4bba-bcd5-02821c17bf75" &&
				originalProfileCoverImagePath !== coverImage[0].filename
			) {
				await deleteFile(originalProfileCoverImagePath);
			}
		}

		res.status(200).json({ msg: "Success", user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
