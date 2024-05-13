import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { __dirname } from "../index.js";

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

		if (userGroups.size === 0) {
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

		// pagination for 10 groups
		const userGroupsArr = await Promise.all(
			paginatedGroupsIds.map(async (groupId) => {
				const group = await Group.findById(groupId).select({
					groupCoverImagePath: 0,
					groupBio: 0,
					groupAdminId: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				});
				if (group) {
					return group;
				}
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
		if (userGroups.size === 0) {
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
			{
				$project: {
					groupCoverImagePath: 0,
					groupBio: 0,
					groupAdminId: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				},
			},
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
			{
				$project: {
					groupCoverImagePath: 0,
					groupBio: 0,
					groupAdminId: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				},
			},
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
			{
				$project: {
					groupCoverImagePath: 0,
					groupBio: 0,
					groupAdminId: 0,
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				},
			},
		]);

		res.status(200).json({ msg: "Success", returnRandomGroupsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getGroup = async (req, res) => {
	try {
		const { groupId } = req.query;

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		res.status(200).json({ msg: "Success", returnGroup: group });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMembers = async (req, res) => {
	try {
		const limit = 10;
		const { groupId } = req.query;
		const membersArr = JSON.parse(req.query.membersArr) || [];

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		const numberOfMembers = group.members.size;

		let includedMembers = new Array();

		// exclude already-picked members
		for (let memberId of group.members.keys()) {
			if (!membersArr.includes(memberId)) {
				includedMembers.push(new mongoose.Types.ObjectId(memberId));
			}
			// limit the number of members to be returned to 10
			if (includedMembers.length === limit) {
				break;
			}
		}

		const returnMembersArr = await Promise.all(
			includedMembers.map(async (memberId) => {
				const member = await User.findById(memberId);
				if (member) {
					const { _id, userName, userProfile, userGender } = member;
					const { profileImagePath } = userProfile;
					return {
						_id,
						userName,
						profileImagePath,
						userGender,
					};
				}
			})
		);

		res.status(200).json({ msg: "Success", returnMembersArr, numberOfMembers });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedMembers = async (req, res) => {
	try {
		const { groupId, searchText } = req.query;
		const limit = 10;
		const membersArr = JSON.parse(req.query.membersArr) || [];

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		const membersMap = group.members;

		// GET ALL MEMBERS IDS
		let memberIds = new Array();
		for (const [memberId] of membersMap) {
			memberIds.push(new mongoose.Types.ObjectId(memberId));
		}

		// exclude already-picked members & limit 10 members
		const users = await User.aggregate([
			{
				$match: {
					_id: {
						$in: memberIds,
						$nin: membersArr.map(
							(memberId) => new mongoose.Types.ObjectId(memberId)
						),
					},
					userName: { $regex: searchText, $options: "i" },
				},
			},
			{ $limit: limit },
		]);

		// only return necessary data
		const returnMembersArr = users.map((user) => ({
			_id: user._id,
			userName: user.userName,
			profileImagePath: user.userProfile.profileImagePath,
			userGender: user.userGender,
		}));

		res.status(200).json({ msg: "Success", returnMembersArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const removeMember = async (req, res) => {
	try {
		const { userId, groupId } = req.body;

		const updatedUser = await User.findByIdAndUpdate(userId, {
			$unset: { [`groups.${groupId}`]: 1 },
		});

		if (!updatedUser) {
			return res.status(404).json({ msg: "Fail to remove member" });
		}

		const updatedGroup = await Group.findByIdAndUpdate(
			groupId,
			{
				$unset: { [`members.${userId}`]: 1 },
			},
			{ new: true }
		);

		if (!updatedGroup) {
			return res.status(404).json({ msg: "Fail to remove member" });
		}

		res.status(200).json({
			msg: "Success",
			userId: updatedUser._id,
			numberOfMembers: updatedGroup.members.size,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const leaveGroup = async (req, res) => {
	try {
		const { userId, groupId } = req.body;

		const updatedUser = await User.findByIdAndUpdate(userId, {
			$unset: { [`groups.${groupId}`]: 1 },
		});

		if (!updatedUser) {
			return res.status(404).json({ msg: "Fail to remove member" });
		}

		const updatedGroup = await Group.findByIdAndUpdate(
			groupId,
			{
				$unset: { [`members.${userId}`]: 1 },
			},
			{ new: true }
		);

		if (!updatedGroup) {
			return res.status(404).json({ msg: "Fail to remove member" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGroupInfo = async (req, res) => {
	try {
		const { groupId } = req.query;

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		const returnedGroup = {
			groupName: group.groupName,
			groupBio: group.groupBio,
			groupImagePath: group.groupImagePath,
			groupCoverImagePath: group.groupCoverImagePath,
		};

		res.status(200).json({ msg: "Success", returnedGroup });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editGroup = async (req, res) => {
	try {
		const { groupId, groupName, groupBio } = req.body;

		const groupImage = req.files && req.files.groupImage;
		const groupCoverImage = req.files && req.files.groupCoverImage;

		const originalGroup = await Group.findById(groupId);

		// Delete original images if they exist and their name are not default
		if (groupImage) {
			if (
				originalGroup.groupImagePath !== "default-group-image.png" &&
				originalGroup.groupImagePath !== groupImage[0].filename
			) {
				const groupImagePath = path.join(
					__dirname,
					"public/images/group",
					originalGroup.groupImagePath
				);
				fs.unlinkSync(groupImagePath);
			}
		}

		if (groupCoverImage) {
			if (
				originalGroup.groupCoverImagePath !== "default-group-cover-image.jpg" &&
				originalGroup.groupCoverImagePath !== groupCoverImage[0].filename
			) {
				const groupCoverImagePath = path.join(
					__dirname,
					"public/images/group",
					originalGroup.groupCoverImagePath
				);
				fs.unlinkSync(groupCoverImagePath);
			}
		}

		let group;

		// without updating images
		if (!groupImage && !groupCoverImage) {
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupName,
					groupBio,
				},
			});
		} else if (!groupImage) {
			// only update cover image
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupCoverImagePath: groupCoverImage[0].filename,
					groupName,
					groupBio,
				},
			});
		} else if (!groupCoverImage) {
			// only update group image
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupImagePath: groupImage[0].filename,
					groupName,
					groupBio,
				},
			});
		} else {
			// update both images
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupImagePath: groupImage[0].filename,
					groupCoverImagePath: groupCoverImage[0].filename,
					groupName,
					groupBio,
				},
			});
		}

		if (!group) {
			return res.status(400).json({ msg: "Fail to update group" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getGroupAdminId = async (req, res) => {
	try {
		const { groupId } = req.query;

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		res
			.status(200)
			.json({ msg: "Success", returnGroupAdminId: group.groupAdminId });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMemberStatus = async (req, res) => {
	try {
		const { groupId, userId } = req.query;

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		const isMember = group.members.has(userId);

		res.status(200).json({ msg: "Success", isMember });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
