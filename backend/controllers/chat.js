import { User } from "../models/userModel.js";
import { addNewMessage, updateChatsViewed } from "../API/firestoreAPI.js";
import { uploadFile } from "../middleware/handleFile.js";

export const retrieveUser = async (req, res) => {
	try {
		const { userId } = req.query;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friend = {
			_id: user._id,
			userName: user.userName,
			imagePath: user.userProfile.profileImagePath,
			profileFrameColor: user.userProfile.profileFrameColor,
		};

		res.status(200).json({ msg: "Success", friend });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { userName, userId, friendId, message, type } = req.body;
		const image = req.file;

		const imageURL = type === "image" ? await uploadFile("chat/", image) : "";

		await addNewMessage({
			userName,
			userId,
			friendId,
			message,
			imageURL,
			type,
		});

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getChatsProfile = async (req, res) => {
	try {
		const { chats } = JSON.parse(req.query.chats);

		let returnedChats = [];

		for (const chat of chats) {
			const friend = await User.findById(chat.friendId);

			returnedChats.push({
				id: chat.id,
				imagePath: friend.userProfile.profileImagePath,
				userName: friend.userName,
			});
		}

		res.status(200).json({ msg: "Success", returnedChats });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const updateViewed = async (req, res) => {
	try {
		const { receiverId, senderId } = req.body;

		await updateChatsViewed({ receiverId, senderId });

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
