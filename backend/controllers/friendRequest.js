import mongoose from "mongoose";
import { FriendRequest } from "../models/friendRequestModel.js";
import { User } from "../models/userModel.js";
import {
	addFriendRequest,
	removeFriendRequest,
	updateFriendRequest,
} from "../API/firestoreAPI.js";

export const sendFriendRequest = async (req, res) => {
	try {
		const { requestorId, receiverId } = req.body;
		const newFriendRequest = new FriendRequest({
			requestorId,
			receiverId,
		});

		const savedFriendRequest = await newFriendRequest.save();

		if (!savedFriendRequest) {
			return res.status(400).json({ msg: "Friend request not created" });
		}

		const user = await User.findById(requestorId);

		const userName = user.userName;

		await addFriendRequest({
			userId: requestorId,
			requestId: savedFriendRequest._id.toString(),
			userName,
			receiverId,
		});

		res.status(201).json({ msg: "Success", savedFriendRequest });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getFriendRequest = async (req, res) => {
	try {
		const { requestorId, receiverId } = req.query;

		const acceptedFriendRequest = await FriendRequest.findOne({
			$or: [
				{
					requestorId: requestorId,
					receiverId: receiverId,
					status: "accepted",
				},
				{
					requestorId: receiverId,
					receiverId: requestorId,
					status: "accepted",
				},
			],
		});

		const sentFriendRequest = await FriendRequest.findOne({
			requestorId: requestorId,
			receiverId: receiverId,
			status: "pending",
		});

		const receivedFriendRequest = await FriendRequest.findOne({
			requestorId: receiverId,
			receiverId: requestorId,
			status: "pending",
		});

		// both users do not make a friend request
		if (acceptedFriendRequest) {
			// they are friends
			return res.status(200).json({
				msg: "Already friend",
				returnFriendRequest: acceptedFriendRequest,
			});
		} else if (!sentFriendRequest && !receivedFriendRequest) {
			return res.status(200).json({ msg: "No request" });
		} else if (sentFriendRequest) {
			// user send to another user
			return res.status(200).json({
				msg: "Sent friend request",
				returnFriendRequest: sentFriendRequest,
			});
		} else if (receivedFriendRequest) {
			// another user send to user
			return res.status(200).json({
				msg: "Received friend request",
				returnFriendRequest: receivedFriendRequest,
			});
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const cancelFriendRequest = async (req, res) => {
	try {
		const { friendRequestId } = req.body;

		const deletedFriendRequest = await FriendRequest.findByIdAndDelete(
			friendRequestId,
			{ new: true }
		);

		if (!deletedFriendRequest) {
			return res.status(404).json({ msg: "Friend request not found" });
		}

		const userId = deletedFriendRequest.requestorId.toString();
		const requestId = deletedFriendRequest._id.toString();

		// firebase
		await removeFriendRequest({ userId, requestId });

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const acceptFriendRequest = async (req, res) => {
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

		user.userFriendsMap.set(receiverId, true);
		friend.userFriendsMap.set(requestorId, true);

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

		const updatedFriendRequest = await FriendRequest.findByIdAndUpdate(
			friendRequestId,
			{ status: "accepted" },
			{ new: true }
		);

		if (!updatedFriendRequest) {
			return res
				.status(400)
				.json({ msg: "Friend request not found or already accepted" });
		}

		// firebase
		const userId = requestorId;
		const requestId = updatedFriendRequest._id.toString();
		const userName = friend.userName;

		await updateFriendRequest({
			userId,
			requestId,
			userName,
			receiverId,
		});

		res.status(200).json({ msg: "Success", updatedFriendRequest, updatedUser });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const rejectFriendRequest = async (req, res) => {
	try {
		const { friendRequestId } = req.body;

		const rejectedFriendRequest = await FriendRequest.findByIdAndDelete(
			friendRequestId,
			{ new: true }
		);

		if (!rejectedFriendRequest) {
			return res.status(404).json({ msg: "Friend request not found" });
		}

		// firebase
		const userId = rejectedFriendRequest.requestorId.toString();
		const requestId = friendRequestId;
		await removeFriendRequest({ userId, requestId });

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getFriendRequests = async (req, res) => {
	try {
		const { receiverId } = req.query;
		const requestIds = JSON.parse(req.query.requestIds);
		const limit = 10;

		const receivedFriendRequests = await FriendRequest.find({
			receiverId: receiverId,
			status: "pending",
			_id: {
				$nin: requestIds.map((id) => new mongoose.Types.ObjectId(id)),
			},
		})
			.populate({
				path: "requestorId",
				model: "User",
				select: "userName userProfile userGender",
			})
			.limit(limit)
			.exec();

		if (!receivedFriendRequests) {
			return res.status(404).json({ msg: "Friend requests not found" });
		}

		res
			.status(200)
			.json({ msg: "Success", returnFriendRequests: receivedFriendRequests });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getFriendRequestsAmount = async (req, res) => {
	try {
		const { receiverId } = req.query;

		const receivedFriendRequests = await FriendRequest.find({
			receiverId: receiverId,
			status: "pending",
		});

		if (!receivedFriendRequests) {
			return res.status(404).json({ msg: "Friend requests not found" });
		}

		if (receivedFriendRequests.length === 0) {
			return res.status(200).json({ msg: "No friend reqeust" });
		}

		res.status(200).json({
			msg: "Success",
			returnFriendRequests: receivedFriendRequests,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getPendingFriendRequests = async (req, res) => {
	try {
		const limit = 10;
		const { requestorId } = req.query;
		const pendingIds = JSON.parse(req.query.pendingIds);

		const pendingFriendRequests = await FriendRequest.find({
			requestorId: requestorId,
			status: "pending",
			_id: {
				$nin: pendingIds.map((id) => new mongoose.Types.ObjectId(id)),
			},
		})
			.populate({
				path: "receiverId",
				model: "User",
				select: "userName userProfile userGender",
			})
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();

		if (!pendingFriendRequests) {
			return res.status(404).json({ msg: "Friend requests not found" });
		}

		res
			.status(200)
			.json({ msg: "Success", returnFriendRequests: pendingFriendRequests });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getPendingFriendRequestsAmount = async (req, res) => {
	try {
		const { requestorId } = req.query;

		const pendingFriendRequests = await FriendRequest.find({
			requestorId: requestorId,
			status: "pending",
		});

		if (!pendingFriendRequests) {
			return res.status(404).json({ msg: "Friend requests not found" });
		}

		if (pendingFriendRequests.length === 0) {
			return res.status(200).json({ msg: "No pending friend reqeust" });
		}

		res
			.status(200)
			.json({ msg: "Success", returnFriendRequests: pendingFriendRequests });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
