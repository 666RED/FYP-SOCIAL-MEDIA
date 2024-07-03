import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { updateViewedValue } from "../API/firestoreAPI.js";

export const getNotificationsProfile = async (req, res) => {
	try {
		const { notifications } = JSON.parse(req.query.notifications);

		let returnedNotifications = [];

		for (const notification of notifications) {
			if (notification.type === "Group") {
				const group = await Group.findById(notification.acceptGroupId);

				returnedNotifications.push({
					id: notification.id,
					imagePath: group.groupImagePath,
					type: "Group",
				});
			} else if (notification.type === "Admin") {
				returnedNotifications.push({
					id: notification.id,
					imagePath: "",
					type: "Admin",
				});
			} else {
				const user = await User.findById(notification.sender);
				returnedNotifications.push({
					id: notification.id,
					imagePath: user.userProfile.profileImagePath,
					type: "User",
				});
			}
		}

		res.status(200).json({ msg: "Success", returnedNotifications });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getNotificationProfile = async (req, res) => {
	try {
		const { id, sender, type } = req.query;

		let returnedNotification = {};

		if (type === "Group") {
			const group = await Group.findById(sender);

			returnedNotification = {
				id: id,
				imagePath: group.groupImagePath,
				type: "Group",
			};
		} else if (type === "Admin") {
			returnedNotification = {
				id: id,
				imagePath: "",
				type: "Admin",
			};
		} else {
			const user = await User.findById(sender);

			returnedNotification = {
				id: id,
				imagePath: user.userProfile.profileImagePath,
				type: "User",
			};
		}

		res.status(200).json({ msg: "Success", returnedNotification });
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
