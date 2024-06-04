import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

export const updatePersonalInfo = async (req, res) => {
	try {
		const { userId, userName, userGender, userPhoneNumber } = req.body;

		const existingPhoneNumberUser = await User.findOne({
			userPhoneNumber: userPhoneNumber,
		});

		if (existingPhoneNumberUser && existingPhoneNumberUser._id != userId) {
			return res
				.status(400)
				.json({ msg: "Phone number is registerd by other user" });
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				userName: userName,
				userGender: userGender,
				userPhoneNumber: userPhoneNumber,
			},
			{ new: true }
		).select(
			"-createdAt -updatedAt -__v -verificationCode -removed -groups -userFriendsMap -userPassword"
		);

		if (!updatedUser) {
			return res.status(400).json({ msg: "Fail to update user" });
		}

		res.status(200).json({ msg: "Success", updatedUser });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const verifyOldPassword = async (req, res) => {
	try {
		const { oldPassword, userId } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({ msg: "Not exist" });
		}

		const isMatch = await bcrypt.compare(oldPassword, user.userPassword);

		if (!isMatch) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const changePassword = async (req, res) => {
	try {
		const { userId, password } = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const user = await User.findByIdAndUpdate(userId, {
			$set: { userPassword: passwordHash },
			new: true,
		});

		if (!user) {
			return res.status(400).json({ msg: "User not found" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const applyFrame = async (req, res) => {
	try {
		const { userId, frameColor } = req.body;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				"userProfile.profileFrameColor": frameColor,
			},
			{ new: true }
		).select(
			"-createdAt -updatedAt -__v -verificationCode -removed -groups -userFriendsMap -userPassword"
		);

		if (!updatedUser) {
			return res.status(400).json({ msg: "Fail to apply new frame" });
		}

		res.status(200).json({ msg: "Success", updatedUser });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
