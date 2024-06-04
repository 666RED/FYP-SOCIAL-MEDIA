import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"; // encrypt the password
import jwt from "jsonwebtoken"; // send the user a web token that is used for authorization

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

		delete savedUser.password;

		res.status(201).json({ msg: "Success", savedUser }); // 201: something has been created, frontend receive savedUser as the response
	} catch (err) {
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
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};
