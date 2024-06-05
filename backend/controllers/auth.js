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
		});

		const existingPhoneNumber = await User.findOne({
			userPhoneNumber: userPhoneNumber,
		});

		if (existingEmail) {
			return res.status(400).json({ msg: "Email existed" });
		}

		if (existingPhoneNumber) {
			return res.status(400).json({ msg: "Phone number existed" });
		}

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(userPassword, salt);

		const newUser = new User({
			userName,
			userGender,
			userEmailAddress,
			userPhoneNumber,
			userPassword: passwordHash,
		});

		const savedUser = await newUser.save();

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
						pass: "thpd fawn tbgy nalr",
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

		// delete savedUser.password;

		res.status(201).json({ msg: "Success" }); // 201: something has been created, frontend receive savedUser as the response
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
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
		}

		const isMatch = await bcrypt.compare(userPassword, user.userPassword); // use the same salt to compare the two passwords
		if (!isMatch) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		// token => enhance the security and functionality of the login process (authentication & authorization)
		// improve the user experience by reducing the need for users to re-enter their credentials frequently
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

		user.userPassword = undefined;

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

		// Update user's confirmed status in the database
		await User.findByIdAndUpdate(id, { confirmed: true });

		// Redirect to the success page after updating confirmation status
		res.redirect(`${frontendServer}`);
	} catch (e) {
		console.error("Error verifying token:", e);
		res.status(500).send("Error verifying token");
	}
};
