import { User } from "../models/userModel.js";
import { FriendRequest } from "../models/friendRequestModel.js";
import mongoose from "mongoose";

export const getFriends = async (req, res) => {
	try {
		const { userId, friends } = req.query;
		const limit = 10;

		const friendsArray = JSON.parse(friends);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		if (user.userFriendsMap.size === 0) {
			return res.status(200).json({ msg: "No friend" });
		}

		const excludedFriends = friendsArray.map((friend) => friend._id);

		let returnFriendsArr = [];

		for (let friendId of user.userFriendsMap.keys()) {
			if (!excludedFriends.includes(friendId)) {
				const friend = await User.findById(friendId);
				returnFriendsArr.push(friend);
				if (returnFriendsArr.length == limit) {
					break;
				}
			}
		}

		returnFriendsArr = returnFriendsArr.map((friend) => {
			const {
				userEmailAddress,
				userPhoneNumber,
				groups,
				createdAt,
				updatedAt,
				userPassword,
				verificationCode,
				__v,
				...rest
			} = friend._doc;

			const { userProfileImagePath } = rest.userProfile;

			return { ...rest, userProfileImagePath };
		});

		const numberOfFriends = user.userFriendsMap.size;

		res.status(200).json({ msg: "Success", returnFriendsArr, numberOfFriends });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedFriends = async (req, res) => {
	try {
		const { userId, searchText, friends } = req.query;
		const limit = 10;

		const friendsArray = JSON.parse(friends);

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const friendsMap = user.userFriendsMap;

		let returnFriendsArr = new Array();
		const excludedFriends = friendsArray.map((friend) => friend._id);

		for (let friendId of friendsMap.keys()) {
			if (!excludedFriends.includes(friendId)) {
				const friend = await User.findById(friendId);
				if (friend.userName.toLowerCase().includes(searchText.toLowerCase())) {
					returnFriendsArr.push(friend);
				}
				if (returnFriendsArr.length == limit) {
					break;
				}
			}
		}

		returnFriendsArr = returnFriendsArr.map((friend) => {
			const {
				userEmailAddress,
				userPhoneNumber,
				groups,
				createdAt,
				updatedAt,
				userPassword,
				verificationCode,
				__v,
				...rest
			} = friend._doc;

			const { userProfileImagePath } = rest.userProfile;

			return { ...rest, userProfileImagePath };
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
		console.log(err);

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

		let friendsArr = [];

		for (let friendId of updatedUser.userFriendsMap.keys()) {
			const friend = await User.findById(friendId);
			friend.userPassword = undefined;
			friend.verificationCode = undefined;
			friendsArr.push(friend);
		}

		res.status(200).json({ msg: "Success", friendsArr });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getRandomFriends = async (req, res) => {
	try {
		const { userId, randomFriendsArr } = req.query;

		const randomFriendsArray = JSON.parse(randomFriendsArr);

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
								$nin: randomFriendsArray.map(
									(friend) => new mongoose.Types.ObjectId(friend._id)
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
		console.log(err);

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
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const loadSearchedRandomFriends = async (req, res) => {
	try {
		const { userId, randomFriendsArr, searchText } = req.query;

		const randomFriendsArray = JSON.parse(randomFriendsArr);

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
								$nin: randomFriendsArray.map(
									(friend) => new mongoose.Types.ObjectId(friend._id)
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
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};
