import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { JoinGroupRequest } from "../models/joinGroupRequestModel.js";
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

		let userGroupsIds = Array.from(userGroups.keys())
			.filter((groupId) => !excludedGroups.includes(groupId))
			.slice(0, limit);

		const userGroupsArr = await Group.find({
			_id: { $in: userGroupsIds },
			removed: 0,
		}).select({
			groupCoverImagePath: 0,
			groupBio: 0,
			groupAdminId: 0,
			createdAt: 0,
			updatedAt: 0,
			__v: 0,
		});

		res.status(200).json({ msg: "Success", userGroupsArr });
	} catch (err) {
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

		let userGroupsIds = Array.from(userGroups.keys())
			.filter((groupId) => !excludedGroups.includes(groupId))
			.map((groupId) => new mongoose.Types.ObjectId(groupId));

		const returnUserGroupsArr = await Group.find({
			_id: { $in: userGroupsIds },
			groupName: { $regex: searchText, $options: "i" }, // Case-insensitive search
			removed: 0,
		})
			.select({
				groupCoverImagePath: 0,
				groupBio: 0,
				groupAdminId: 0,
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			})
			.limit(limit);

		res.status(200).json({ msg: "Success", returnUserGroupsArr });
	} catch (err) {
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

		let excludedGroups = Array.from(userGroups.keys()).map(
			(groupId) => new mongoose.Types.ObjectId(groupId)
		);

		excludedGroups.push(
			...randomGroupsArr.map((group) => new mongoose.Types.ObjectId(group._id))
		);

		const returnRandomGroupsArr = await Group.find({
			_id: { $nin: excludedGroups },
			removed: 0,
		})
			.select({
				groupCoverImagePath: 0,
				groupBio: 0,
				groupAdminId: 0,
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			})
			.limit(limit);

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

		let excludedGroups = Array.from(userGroups.keys()).map(
			(groupId) => new mongoose.Types.ObjectId(groupId)
		);
		excludedGroups.push(
			...randomGroupsArr.map((group) => new mongoose.Types.ObjectId(group._id))
		);

		const returnRandomGroupsArr = await Group.find({
			_id: { $nin: excludedGroups },
			groupName: { $regex: new RegExp(searchText, "i") }, // Case-insensitive search
			removed: 0,
		})
			.select({
				groupCoverImagePath: 0,
				groupBio: 0,
				groupAdminId: 0,
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			})
			.limit(limit);

		res.status(200).json({ msg: "Success", returnRandomGroupsArr });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGroup = async (req, res) => {
	try {
		const { groupId } = req.query;

		const group = await Group.findOne({ _id: groupId, removed: 0 });

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
					const { profileImagePath, profileFrameColor } = userProfile;
					return {
						_id,
						userName,
						profileImagePath,
						userGender,
						frameColor: profileFrameColor,
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
			frameColor: user.userProfile.profileFrameColor,
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

		const deletedJoinGroupRequest = await JoinGroupRequest.findOneAndDelete({
			requestorId: userId,
			groupId: groupId,
		});

		if (!deletedJoinGroupRequest) {
			return res.status(404).json({ error: "Fail to remove memeber" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getGroupInfo = async (req, res) => {
	try {
		const { groupId } = req.query;

		const group = await Group.findOne({ _id: groupId, removed: 0 });

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
		const originalGroupImagePath = originalGroup.groupImagePath;
		const originalGroupCoverImagePath = originalGroup.groupCoverImagePath;

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

		// Delete original images if they exist and their name are not default
		if (groupImage) {
			if (
				originalGroupImagePath !== "default-group-image.png" &&
				originalGroupImagePath !== groupImage[0].filename
			) {
				const groupImagePath = path.join(
					__dirname,
					"public/images/group",
					originalGroupImagePath
				);
				fs.unlinkSync(groupImagePath);
			}
		}

		if (groupCoverImage) {
			if (
				originalGroupCoverImagePath !== "default-group-cover-image.jpg" &&
				originalGroupCoverImagePath !== groupCoverImage[0].filename
			) {
				const groupCoverImagePath = path.join(
					__dirname,
					"public/images/group",
					originalGroupCoverImagePath
				);
				fs.unlinkSync(groupCoverImagePath);
			}
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGroupAdminId = async (req, res) => {
	try {
		const { groupId } = req.query;

		const group = await Group.findOne({ _id: groupId, removed: 0 });

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
