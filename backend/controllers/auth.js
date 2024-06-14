import { User } from "../models/userModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { backendServer, frontendServer } from "../index.js";
import _ from "lodash";

export const register = async (req, res) => {
	try {
		const {
			userName,
			userGender,
			userEmailAddress,
			userPhoneNumber,
			userPassword,
		} = req.body;

		const existingEmail = await User.findOne({
			userEmailAddress: userEmailAddress,
			confirmed: true,
		});

		const existingPhoneNumber = await User.findOne({
			userPhoneNumber: userPhoneNumber,
			confirmed: true,
		});

		if (existingEmail) {
			return res.status(400).json({ msg: "Email existed" });
		}

		if (existingPhoneNumber) {
			return res.status(400).json({ msg: "Phone number existed" });
		}

		const notYetConfirmedEmail = await User.findOne({
			userEmailAddress: userEmailAddress,
			confirmed: false,
		});

		let user;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(userPassword, salt);

		if (!notYetConfirmedEmail) {
			const newUser = new User({
				userName,
				userGender,
				userEmailAddress,
				userPhoneNumber,
				userPassword: passwordHash,
			});

			user = await newUser.save();

			if (!user) {
				return res.status(400).json({ msg: "Fail to register user" });
			}
		} else {
			const savedUser = await User.findOneAndUpdate(
				{ userEmailAddress: userEmailAddress },
				{
					$set: {
						userPhoneNumber: userPhoneNumber,
						userName: userName,
						userGender: userGender,
						userPassword: passwordHash,
					},
				},
				{ new: true }
			);

			user = savedUser;
		}

		await sign(user, userEmailAddress);

		delete user.password;

		res.status(201).json({ msg: "Success" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
};

const sign = async (savedUser, userEmailAddress) => {
	jwt.sign(
		{
			user: { id: savedUser._id }, // Store the user's id in the token payload
		},
		process.env.EMAIL_SECRET, // Secret key for JWT
		{
			expiresIn: "1d", // Token expiration time (1 day)
		},
		(err, emailToken) => {
			// Callback function to handle JWT signing
			if (err) {
				console.error("Error generating email token:", err);
				return;
			}

			// Construct the confirmation URL with the generated token
			const url = `${backendServer}/confirmation/${emailToken}`;

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
				subject: "Confirm Email",
				html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
			};

			// Send an email to the user with the confirmation URL
			transporter.sendMail(mailOptions);
		}
	);
};

export const login = async (req, res) => {
	try {
		const { userEmailAddress, userPassword } = req.body;

		const user = await User.findOne({
			userEmailAddress: userEmailAddress,
		}).select(
			"-createdAt -updatedAt -__v -verificationCode -removed -groups -userFriendsMap"
		);

		if (!user) {
			return res.status(400).json({ msg: "Not exist" });
		} else if (!user.confirmed) {
			sign(user, user.userEmailAddress);
			return res.status(400).json({ msg: "Not activated yet" });
		}

		const isMatch = await bcrypt.compare(userPassword, user.userPassword);
		if (!isMatch) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

		user.userPassword = undefined;

		const numberOfUser = await User.countDocuments();

		if (user.firstLogin) {
			// for early user reward
			if (numberOfUser <= 100) {
				const updatedUser = await User.findOneAndUpdate(
					{ userEmailAddress },
					{ firstLogin: false, isEarlyUser: true },
					{ new: true }
				);

				if (!updatedUser) {
					return res.status(400).json({ msg: "Fail to login" });
				}
				return res
					.status(200)
					.json({ msg: "Early user", token, user: updatedUser });
			} else {
				const updatedUser = await User.findOneAndUpdate(
					{ userEmailAddress },
					{ firstLogin: false },
					{ new: true }
				);
				if (!updatedUser) {
					return res.status(400).json({ msg: "Fail to login" });
				}
				return res
					.status(200)
					.json({ msg: "Success", token, user: updatedUser });
			}
		}

		res.status(200).json({ msg: "Success", token, user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const confirmation = async (req, res) => {
	try {
		const {
			user: { id },
		} = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

		await User.findByIdAndUpdate(id, { confirmed: true });

		res.redirect(`${frontendServer}`);
	} catch (e) {
		console.error("Error verifying token:", e);
		res.status(500).send("Error verifying token");
	}
};
