import { User } from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
	try {
		const { userId } = req.body;

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

		let user;

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
		res.status(500).json({ error: err.message });
	}
};
