import { User } from "../models/userModel.js";
import { FriendRequest } from "../models/friendRequestModel.js";
import mongoose from "mongoose";

export const getFriends = async (req, res) => {
	try {
		const { userId } = req.query;
		const limit = 10;

		const friendIds = JSON.parse(req.query.friendIds);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		if (user.userFriendsMap.size === 0) {
			return res.status(200).json({ msg: "No friend" });
		}

		const excludedFriends = friendIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const friendsIds = Array.from(user.userFriendsMap.keys());
		const friendsToFetch = friendsIds.filter(
			(friendId) => !excludedFriends.includes(friendId)
		);

		const friendsData = await User.find({ _id: { $in: friendsToFetch } })
			.limit(limit)
			.select("-userPassword -verificationCode -__v") // Projection to exclude sensitive fields
			.populate({
				path: "userProfile",
				select: "profileImagePath, profileFrameColor",
			});

		const numberOfFriends = user.userFriendsMap.size;

		res
			.status(200)
			.json({ msg: "Success", returnFriendsArr: friendsData, numberOfFriends });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedFriends = async (req, res) => {
	try {
		const { userId, searchText } = req.query;
		const limit = 10;

		const friendIds = JSON.parse(req.query.friendIds);

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friendsMap = user.userFriendsMap;

		const excludedFriends = friendIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const friendsToFetch = Array.from(friendsMap.keys()).filter(
			(friendId) => !excludedFriends.includes(friendId)
		);

		const friendsData = await User.find({
			_id: { $in: friendsToFetch },
			userName: { $regex: new RegExp(searchText, "i") },
		})
			.limit(limit)
			.select("-userPassword -verificationCode -__v") // Projection to exclude sensitive fields
			.populate({
				path: "userProfile",
				select: "profileImagePath, profileFrameColor",
			}); // Populate profileImagePath

		const returnFriendsArr = friendsData.map((friend) => {
			const {
				userEmailAddress,
				userPhoneNumber,
				groups,
				createdAt,
				updatedAt,
				...rest
			} = friend._doc;
			const { profileImagePath } = rest.userProfile;
			return { ...rest, profileImagePath };
		});

		res.status(200).json({ msg: "Success", returnFriendsArr });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeFriend = async (req, res) => {
	try {
		const { requestorId, receiverId, friendRequestId } = req.body;

		const user = await User.findById(requestorId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friend = await User.findById(receiverId);

		if (!friend) {
			return res.status(404).json({ msg: "Friend not found" });
		}

		user.userFriendsMap.delete(receiverId);
		friend.userFriendsMap.delete(requestorId);

		const updatedUser = await User.findByIdAndUpdate(
			requestorId,
			{ $set: { userFriendsMap: user.userFriendsMap } },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ msg: "User not found" });
		}

		const updatedFriend = await User.findByIdAndUpdate(
			receiverId,
			{ $set: { userFriendsMap: friend.userFriendsMap } },
			{ new: true }
		);

		if (!updatedFriend) {
			return res.status(404).json({ msg: "Friend not found" });
		}

		const deletedFriendRequest = await FriendRequest.findByIdAndDelete(
			friendRequestId
		);

		if (!deletedFriendRequest) {
			return res.status(404).json({ msg: "Friend request not found" });
		}

		res.status(200).json({ msg: "Success", updatedUser });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const directRemoveFriend = async (req, res) => {
	try {
		const { requestorId, receiverId } = req.body;

		const deletedFriendRequest = await FriendRequest.findOneAndDelete({
			$or: [
				{ requestorId: requestorId, receiverId: receiverId },
				{ requestorId: receiverId, receiverId: requestorId },
			],
		});

		if (!deletedFriendRequest) {
			return res.status(404).json({ msg: "Friend request not found" });
		}

		const user = await User.findById(requestorId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friend = await User.findById(receiverId);

		if (!friend) {
			return res.status(404).json({ msg: "Friend not found" });
		}

		user.userFriendsMap.delete(receiverId);
		friend.userFriendsMap.delete(requestorId);

		const updatedUser = await User.findByIdAndUpdate(
			requestorId,
			{ $set: { userFriendsMap: user.userFriendsMap } },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ msg: "User not found" });
		}

		const updatedFriend = await User.findByIdAndUpdate(
			receiverId,
			{ $set: { userFriendsMap: friend.userFriendsMap } },
			{ new: true }
		);

		if (!updatedFriend) {
			return res.status(404).json({ msg: "Friend not found" });
		}

		let friendIds = Array.from(updatedUser.userFriendsMap.keys()).map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const friendsArr = await User.find({ _id: { $in: friendIds } }).select(
			"-userPassword -verificationCode"
		);

		// for (let friendId of updatedUser.userFriendsMap.keys()) {
		// 	const friend = await User.findById(friendId);
		// 	friend.userPassword = undefined;
		// 	friend.verificationCode = undefined;
		// 	friendsArr.push(friend);
		// }

		res.status(200).json({ msg: "Success", friendsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getRandomFriends = async (req, res) => {
	try {
		const { userId } = req.query;

		const randomFriendIds = JSON.parse(req.query.randomFriendIds);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friendsMap = user.userFriendsMap;
		let friendsArr = new Array();

		const pendingFriendRequestsArr = await FriendRequest.find({
			$or: [
				{ requestorId: userId, status: "pending" },
				{ receiverId: userId, status: "pending" },
			],
		});

		for (let friendId of friendsMap.keys()) {
			friendsArr.push(friendId);
		}

		const randomFriends = await User.aggregate([
			{
				$match: {
					$and: [
						// not equal to userId
						{ _id: { $ne: new mongoose.Types.ObjectId(userId) } },
						// not friend
						{
							_id: {
								$nin: randomFriendIds.map(
									(id) => new mongoose.Types.ObjectId(id)
								),
							},
						},
						// do not pick already-picked uesrs
						{
							_id: {
								$nin: randomFriendIds.map(
									(id) => new mongoose.Types.ObjectId(id)
								),
							},
						},
						// not pending (receiver)
						{
							_id: {
								$nin: pendingFriendRequestsArr.map(
									(request) => new mongoose.Types.ObjectId(request.receiverId)
								),
							},
						},
						// not pending (requestor)
						{
							_id: {
								$nin: pendingFriendRequestsArr.map(
									(request) => new mongoose.Types.ObjectId(request.requestorId)
								),
							},
						},
					],
				},
			},
			{
				$project: {
					userPassword: 0,
					verificationCode: 0,
				},
			},
			{ $sample: { size: 15 } },
		]);

		if (!randomFriends) {
			return res.status(404).json({ msg: "Fail to retrieve users" });
		}

		res.status(200).json({ msg: "Success", randomFriends: randomFriends });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedRandomFriends = async (req, res) => {
	try {
		const { userId, searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friendsMap = user.userFriendsMap;

		const pendingFriendRequestsArr = await FriendRequest.find({
			$or: [
				{ requestorId: userId, status: "pending" },
				{ receiverId: userId, status: "pending" },
			],
		});

		let friendsArr = new Array();

		for (let friendId of friendsMap.keys()) {
			friendsArr.push(friendId);
		}

		const randomFriends = await User.aggregate([
			{
				$match: {
					$and: [
						// not equal to userId
						{ _id: { $ne: new mongoose.Types.ObjectId(userId) } },
						// not friend
						{
							_id: {
								$nin: friendsArr.map(
									(friendId) => new mongoose.Types.ObjectId(friendId)
								),
							},
						},
						// not pending (receiver)
						{
							_id: {
								$nin: pendingFriendRequestsArr.map(
									(request) => new mongoose.Types.ObjectId(request.receiverId)
								),
							},
						},
						// not pending (requestor)
						{
							_id: {
								$nin: pendingFriendRequestsArr.map(
									(request) => new mongoose.Types.ObjectId(request.requestorId)
								),
							},
						},
						// get matched username
						{
							userName: {
								$regex: searchText,
								$options: "i", // case-insensitive
							},
						},
					],
				},
			},
			{
				$project: {
					userPassword: 0,
					verificationCode: 0,
				},
			},
			{ $sample: { size: 15 } },
		]);

		if (!randomFriends) {
			return res.status(404).json({ msg: "Fail to retrieve users" });
		}

		res.status(200).json({ msg: "Success", randomFriends: randomFriends });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const loadSearchedRandomFriends = async (req, res) => {
	try {
		const { userId, searchText } = req.query;

		const randomFriendIds = JSON.parse(req.query.randomFriendIds);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friendsMap = user.userFriendsMap;
		let friendsArr = new Array();

		const pendingFriendRequestsArr = await FriendRequest.find({
			$or: [
				{ requestorId: userId, status: "pending" },
				{ receiverId: userId, status: "pending" },
			],
		});

		for (let friendId of friendsMap.keys()) {
			friendsArr.push(friendId);
		}

		const randomFriends = await User.aggregate([
			{
				$match: {
					$and: [
						// not equal to userId
						{ _id: { $ne: new mongoose.Types.ObjectId(userId) } },
						// not friend
						{
							_id: {
								$nin: friendsArr.map(
									(friendId) => new mongoose.Types.ObjectId(friendId)
								),
							},
						},
						// do not pick already-picked uesrs
						{
							_id: {
								$nin: randomFriendIds.map(
									(id) => new mongoose.Types.ObjectId(id)
								),
							},
						},
						// not pending (receiver)
						{
							_id: {
								$nin: pendingFriendRequestsArr.map(
									(request) => new mongoose.Types.ObjectId(request.receiverId)
								),
							},
						},
						// not pending (requestor)
						{
							_id: {
								$nin: pendingFriendRequestsArr.map(
									(request) => new mongoose.Types.ObjectId(request.requestorId)
								),
							},
						},
						// get matched username
						{
							userName: {
								$regex: searchText,
								$options: "i", // case-insensitive
							},
						},
					],
				},
			},
			{
				$project: {
					userPassword: 0,
					verificationCode: 0,
				},
			},
			{ $sample: { size: 15 } },
		]);

		if (!randomFriends) {
			return res.status(404).json({ msg: "Fail to retrieve users" });
		}

		res.status(200).json({ msg: "Success", randomFriends: randomFriends });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getIsFriend = async (req, res) => {
	try {
		const { userId, friendId } = req.query;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({ msg: "User not found" });
		}

		if (!Array.from(user.userFriendsMap.keys()).includes(friendId)) {
			return res.status(200).json({ msg: "Not friend" });
		} else {
			return res.status(200).json({ msg: "Friend" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
