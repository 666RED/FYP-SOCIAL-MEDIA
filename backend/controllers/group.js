import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { JoinGroupRequest } from "../models/joinGroupRequestModel.js";
import mongoose from "mongoose";
import { uploadFile, deleteFile } from "../middleware/handleFile.js";
import { removeJoinGroupRequest } from "../API/firestoreAPI.js";

export const createNewGroup = async (req, res) => {
	try {
		const { userId, name, bio } = req.body;

		const groupImage = req.files && req.files.groupImage;
		const groupCoverImage = req.files && req.files.groupCoverImage;

		let newGroup;
		const membersMap = new Map();
		membersMap.set(userId, true);

		// use default group image & cover image
		if (!groupImage && !groupCoverImage) {
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				members: membersMap,
			});
		} // only upload cover image
		else if (!groupImage) {
			const imageURL = await uploadFile("group/", groupCoverImage[0]);
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				groupCoverImagePath: imageURL,
				members: membersMap,
			});
		} // only upload group image
		else if (!groupCoverImage) {
			const imageURL = await uploadFile("group/", groupImage[0]);
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				groupImagePath: imageURL,
				members: membersMap,
			});
		} // upload both group image & cover image
		else {
			const groupImageURL = await uploadFile("group/", groupImage[0]);
			const coverImageURL = await uploadFile("group/", groupCoverImage[0]);
			newGroup = new Group({
				groupName: name,
				groupBio: bio,
				groupAdminId: userId,
				groupImagePath: groupImageURL,
				groupCoverImagePath: coverImageURL,
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
		res.status(500).json({ error: err.message });
	}
};

export const getUserGroups = async (req, res) => {
	try {
		const { userId } = req.query;
		const limit = 10;
		const groupIds = JSON.parse(req.query.groupIds);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		if (userGroups.size === 0) {
			return res.status(200).json({ msg: "No group" });
		}

		let userGroupsIds = Array.from(userGroups.keys())
			.filter((groupId) => !groupIds.includes(groupId))
			.map((groupId) => new mongoose.Types.ObjectId(groupId));

		const userGroupsArr = await Group.find({
			_id: { $in: userGroupsIds },
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

		res.status(200).json({ msg: "Success", userGroupsArr });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getUserGroupsSearch = async (req, res) => {
	try {
		const { userId, searchText } = req.query;
		const limit = 10;
		const groupIds = JSON.parse(req.query.groupIds);

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

		let userGroupsIds = Array.from(userGroups.keys())
			.filter((groupId) => !groupIds.includes(groupId))
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
		const randomGroupIds = JSON.parse(req.query.randomGroupIds);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userGroups = user.groups;

		let excludedGroups = Array.from(userGroups.keys()).map(
			(groupId) => new mongoose.Types.ObjectId(groupId)
		);

		excludedGroups.push(
			...randomGroupIds.map((id) => new mongoose.Types.ObjectId(id))
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
		res.status(500).json({ error: err.message });
	}
};

export const getDiscoverGroupsSearch = async (req, res) => {
	try {
		const { userId, searchText } = req.query;
		const limit = 10;
		const randomGroupIds = JSON.parse(req.query.randomGroupIds) || [];

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
			...randomGroupIds.map((id) => new mongoose.Types.ObjectId(id))
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
		const memberIds = JSON.parse(req.query.memberIds);

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		const numberOfMembers = group.members.size;

		let includedMembers = new Array();

		// exclude already-picked members
		for (let memberId of group.members.keys()) {
			if (!memberIds.includes(memberId)) {
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
		const memberIds = JSON.parse(req.query.memberIds);

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}

		const membersMap = group.members;

		// GET ALL MEMBERS IDS
		let allMemberIds = new Array();
		for (const [memberId] of membersMap) {
			allMemberIds.push(new mongoose.Types.ObjectId(memberId));
		}

		// exclude already-picked members & limit 10 members
		const users = await User.aggregate([
			{
				$match: {
					_id: {
						$in: allMemberIds,
						$nin: memberIds.map((id) => new mongoose.Types.ObjectId(id)),
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

		const deletedJoinGroupRequest = await JoinGroupRequest.findOneAndDelete(
			{
				requestorId: userId,
				groupId: groupId,
			},
			{ new: true }
		);

		// firebase
		await removeJoinGroupRequest({
			userId: userId,
			requestId: deletedJoinGroupRequest._id.toString(),
		});

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

		const deletedJoinGroupRequest = await JoinGroupRequest.findOneAndDelete(
			{
				requestorId: userId,
				groupId: groupId,
			},
			{ new: true }
		);

		if (!deletedJoinGroupRequest) {
			return res.status(404).json({ error: "Fail to remove memeber" });
		}

		// firebase
		await removeJoinGroupRequest({
			userId: userId,
			requestId: deletedJoinGroupRequest._id.toString(),
		});

		res.status(200).json({ msg: "Success" });
	} catch (err) {
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
			const imageURL = await uploadFile("group/", groupCoverImage[0]);
			// only update cover image
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupCoverImagePath: imageURL,
					groupName,
					groupBio,
				},
			});
		} else if (!groupCoverImage) {
			// only update group image
			const imageURL = await uploadFile("group/", groupImage[0]);
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupImagePath: imageURL,
					groupName,
					groupBio,
				},
			});
		} else {
			// update both images
			const groupImageURL = await uploadFile("group/", groupImage[0]);
			const coverImageURL = await uploadFile("group/", groupCoverImage[0]);
			group = await Group.findByIdAndUpdate(groupId, {
				$set: {
					groupImagePath: groupImageURL,
					groupCoverImagePath: coverImageURL,
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
				originalGroupImagePath !==
					"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/group%2F1717572712982-default-group-image.png?alt=media&token=f477f873-41ee-4f68-ae76-11340d7b595b" &&
				originalGroupImagePath !== groupImage[0].filename
			) {
				await deleteFile(originalGroupImagePath);
			}
		}

		if (groupCoverImage) {
			if (
				originalGroupCoverImagePath !==
					"https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/group%2F1717572713265-default-group-cover-image.jpg?alt=media&token=89c92422-f0e5-46e4-b603-9fd7a1ced3ff" &&
				originalGroupCoverImagePath !== groupCoverImage[0].filename
			) {
				await deleteFile(originalGroupCoverImagePath);
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
		console.log(err);

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
