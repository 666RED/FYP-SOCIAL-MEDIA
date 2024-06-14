import { User } from "../models/userModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const authEmail = async (req, res) => {
	try {
		const { userEmailAddress } = req.body;

		const user = await User.findOne({ userEmailAddress: userEmailAddress });

		if (!user) {
			return res.status(400).json({ msg: "Not exist" });
		}

		const verificationCode = (
			Math.floor(Math.random() * 900000) + 100000
		).toString();

		// to be used at authVerificationCode
		user.verificationCode = verificationCode;
		await user.save();

		// Create a transporter using SMTP
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "fsktmconnect@gmail.com",
				pass: process.env.MAILER_SECRET,
			},
		});

		// Define the email options
		const mailOptions = {
			from: "fsktmconnect",
			to: userEmailAddress,
			subject: "Password Recover",
			text: `Your 6-digit verification code is ${verificationCode}`,
		};

		// Send the email
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return res.status(400).json({ msg: "Error" });
			} else {
				res.status(200).json({ msg: "Success", user });
			}
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeCode = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await User.findByIdAndUpdate(userId, {
			$set: { verificationCode: "" },
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

export const autoClearCode = async (req, res) => {
	try {
		const { userId } = req.body;
		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: { verificationCode: "" } },
			{ new: true }
		);

		if (!user) {
			res.status(400).json({ msg: "User not found" });
			console.log("User not found");
		} else {
			res.status(200).json({ msg: "Success" });
			console.log("Verification code updated to empty string successfully");
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.error("Error:", error);
	}
};

export const authVerificationCode = async (req, res) => {
	try {
		const { userId, verificationCode } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		if (user && user.verificationCode === verificationCode) {
			user.verificationCode = "";
			await user.save();
			res.status(200).json({ msg: "Valid code" });
		} else {
			res.status(400).json({ msg: "Invalid code" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const resendCode = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({ msg: "User not found" });
		}

		const verificationCode = (
			Math.floor(Math.random() * 900000) + 100000
		).toString();

		// to be used at authVerificationCode
		user.verificationCode = verificationCode;
		const savedUser = await user.save();

		if (!savedUser) {
			return res.status(400).json({ msg: "Fail to set verification code" });
		}

		// Create a transporter using SMTP
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "fsktmconnect@gmail.com",
				pass: process.env.MAILER_SECRET,
			},
		});

		// Define the email options
		const mailOptions = {
			from: "fsktmconnect",
			to: user.userEmailAddress,
			subject: "Password Recover",
			text: `Your 6-digit verification code is ${verificationCode}`,
		};

		// Send the email
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error("Error:", error);
				return res.status(400).json({ msg: "Error" });
			} else {
				console.log("Email sent:", info.response);
				res.status(200).json({ msg: "Success", user });
			}
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { userId, newPassword } = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(newPassword, salt);

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
