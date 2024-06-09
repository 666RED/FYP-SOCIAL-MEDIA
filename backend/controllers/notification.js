import mongoose from "mongoose";
import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { updateViewedValue } from "../API/firestoreAPI.js";

export const getNotificationsProfile = async (req, res) => {
	try {
		const { notifications } = JSON.parse(req.query.notifications);

		let returnedNotifications = [];

		for (const notification of notifications) {
			if (
				notification.action === "Accept join group" ||
				notification.action === "Add note"
			) {
				const group = await Group.findById(notification.acceptGroupId);

				returnedNotifications.push({
					...notification,
					imagePath: group.groupImagePath,
					type: "Group",
				});
			} else if (
				notification.action === "Dismiss report" ||
				notification.action === "Mark resolved" ||
				notification.action === "Remove post to target" ||
				notification.action === "Remove post to reporter"
			) {
				returnedNotifications.push({ ...notification, type: "Admin" });
			} else {
				const user = await User.findById(notification.sender);
				returnedNotifications.push({
					...notification,
					imagePath: user.userProfile.profileImagePath,
					type: "User",
				});
			}
		}

		res.status(200).json({ msg: "Success", returnedNotifications });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const updateViewed = async (req, res) => {
	try {
		const { id, viewed } = req.body;

		if (!viewed) {
			await updateViewedValue({ id });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
