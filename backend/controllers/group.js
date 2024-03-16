import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";

export const createNewGroup = async (req, res) => {
	try {
		const { userId, name, bio } = req.body;

		const groupImage = req.files && req.files.groupImage;
		const groupCoverImage = req.files && req.files.groupCoverImage;

		let newGroup;
		const membersMap = new Map();
		membersMap.set(userId, true);

		if (!groupImage && !groupCoverImage) {
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				members: membersMap,
			});
		} else if (!groupImage) {
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				groupCoverImagePath: groupCoverImage[0].filename,
				members: membersMap,
			});
		} else if (!groupCoverImage) {
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				groupImagePath: groupImage[0].filename,
				members: membersMap,
			});
		} else {
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				groupImagePath: groupImage[0].filename,
				groupCoverImagePath: groupCoverImage[0].filename,
				members: membersMap,
			});
		}

		const savedGroup = await newGroup.save();

		if (!savedGroup) {
			return res.status(400).json({ msg: "Fail to create new group" });
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: { [`groups.${savedGroup._id}`]: true } },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(400).json({ msg: "Fail to update user" });
		}

		res.status(201).json({ msg: "Success", savedGroup });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getUserGroups = async (req, res) => {
	try {
		const { userId } = req.query;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		if (Object.keys(userGroups).length === 0) {
			return res.status(200).json({ msg: "No group" });
		}

		let userGroupsArr = new Array();

		for (const [groupId] of userGroups) {
			const group = await Group.findById(groupId);
			userGroupsArr.push(group);
		}

		res.status(200).json({ msg: "Success", userGroupsArr });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getDiscoverGroups = async (req, res) => {
	try {
		const { userId, randomGroupsArr } = req.query;

		const randomGroupsArray = JSON.parse(randomGroupsArr);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const groups = await Group.find();

		if (!groups) {
			return res.status(404).json({ msg: "Fail to find groups" });
		}

		if (groups.length === 0) {
			return res.status(200).json({ msg: "No group" });
		}

		res.status(200).json({ msg: "Success", groups });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
