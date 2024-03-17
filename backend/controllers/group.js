import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

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
		const limit = 10;
		const groupsArr = JSON.parse(req.query.groupsArr) || [];

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		if (Object.keys(userGroups).length === 0) {
			return res.status(200).json({ msg: "No group" });
		}

		const excludedGroups = groupsArr.map((group) => group._id);

		let userGroupsIds = new Array();

		// get haven't picked group ids
		for (const [groupId] of userGroups) {
			if (!excludedGroups.includes(groupId)) {
				userGroupsIds.push(groupId);
			}
		}

		const paginatedGroupsIds = userGroupsIds.slice(0, limit);

		let userGroupsArr = new Array();

		// pagination for 10 groups
		userGroupsArr = await Promise.all(
			paginatedGroupsIds.map(async (groupId) => {
				const group = await Group.findById(groupId);
				if (!group) {
					return res.status(404).json({ msg: "Fail to find groups" });
				}
				return group;
			})
		);

		res.status(200).json({ msg: "Success", userGroupsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getUserGroupsSearch = async (req, res) => {
	try {
		const { userId, searchText } = req.query;
		const limit = 10;
		const groupsArr = JSON.parse(req.query.groupsArr) || [];

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		// NO GROUP
		if (Object.keys(userGroups).length === 0) {
			return res.status(200).json({ msg: "No group" });
		}

		const excludedGroups = groupsArr.map((group) => group._id);

		let userGroupsIds = new Array();

		// get haven't picked group ids
		for (const [groupId] of userGroups) {
			if (!excludedGroups.includes(groupId)) {
				userGroupsIds.push(new mongoose.Types.ObjectId(groupId));
			}
		}

		const returnUserGroupsArr = await Group.aggregate([
			{
				$match: {
					_id: { $in: userGroupsIds },
					groupName: { $regex: searchText, $options: "i" }, // Case-insensitive search
				},
			},
			{ $limit: limit },
		]);

		res.status(200).json({ msg: "Success", returnUserGroupsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getDiscoverGroups = async (req, res) => {
	try {
		const { userId } = req.query;
		const limit = 10;
		const randomGroupsArr = JSON.parse(req.query.randomGroupsArr) || [];

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		let excludedGroups = new Array();

		for (const [groupId] of userGroups) {
			excludedGroups.push(new mongoose.Types.ObjectId(groupId));
		}

		excludedGroups = [
			...excludedGroups,
			...randomGroupsArr.map((group) => new mongoose.Types.ObjectId(group._id)),
		];

		const returnRandomGroupsArr = await Group.aggregate([
			{
				$match: {
					_id: { $nin: excludedGroups },
				},
			},
			{ $limit: limit },
		]);

		if (!returnRandomGroupsArr) {
			return res.status(404).json({ msg: "Fail to find groups" });
		}

		if (returnRandomGroupsArr.length < 1) {
			return res.status(200).json({ msg: "No group" });
		}

		res.status(200).json({ msg: "Success", returnRandomGroupsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getDiscoverGroupsSearch = async (req, res) => {
	try {
		const { userId, searchText } = req.query;
		const limit = 10;
		const randomGroupsArr = JSON.parse(req.query.randomGroupsArr) || [];

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		let excludedGroups = new Array();

		for (const [groupId] of userGroups) {
			excludedGroups.push(new mongoose.Types.ObjectId(groupId));
		}

		excludedGroups = [
			...excludedGroups,
			...randomGroupsArr.map((group) => new mongoose.Types.ObjectId(group._id)),
		];

		const returnRandomGroupsArr = await Group.aggregate([
			{
				$match: {
					_id: { $nin: excludedGroups },
					groupName: { $regex: searchText, $options: "i" }, // Case-insensitive search
				},
			},
			{ $limit: limit },
		]);

		res.status(200).json({ msg: "Success", returnRandomGroupsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};
