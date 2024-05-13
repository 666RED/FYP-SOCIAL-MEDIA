import { JoinGroupRequest } from "../models/joinGroupRequestModel.js";
import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

export const sendJoinGroupRequest = async (req, res) => {
	try {
		const { requestorId, groupId } = req.body;

		const newJoinGroupRequest = new JoinGroupRequest({
			requestorId,
			groupId,
		});

		const savedJoinGroupRequest = await newJoinGroupRequest.save();

		if (!savedJoinGroupRequest) {
			return res.status(400).json({ msg: "Join group request not created" });
		}

		res.status(201).json({ msg: "Success", savedJoinGroupRequest });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getJoinGroupRequests = async (req, res) => {
	try {
		const limit = 10;
		const groupId = req.query.groupId;
		const joinGroupRequestsArr =
			JSON.parse(req.query.joinGroupRequestsArr) || [];

		const excludeJoinGroupRequests = joinGroupRequestsArr.map(
			(joinGroupRequest) => new mongoose.Types.ObjectId(joinGroupRequest._id)
		);

		const returnJoinGroupRequestsArr = await JoinGroupRequest.find({
			_id: { $nin: excludeJoinGroupRequests },
			groupId: groupId,
			status: "pending",
		})
			.limit(limit)
			.populate(
				"requestorId",
				"userName userGender userProfile.profileImagePath"
			);

		if (!returnJoinGroupRequestsArr) {
			return res.status(404).json({ msg: "Join group request not found" });
		}

		if (returnJoinGroupRequestsArr.length === 0) {
			return res.status(200).json({ msg: "No join group request" });
		}

		res.status(200).json({ msg: "Success", returnJoinGroupRequestsArr });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getJoinGroupRequest = async (req, res) => {
	try {
		const { requestorId, groupId } = req.query;

		const joinGroupRequest = await JoinGroupRequest.findOne({
			requestorId: requestorId,
			groupId: groupId,
		});

		if (!joinGroupRequest) {
			return res.status(200).json({ msg: "No request" });
		} else if (joinGroupRequest.status === "pending") {
			return res
				.status(200)
				.json({ msg: "Sent join group request", joinGroupRequest });
		} else if (joinGroupRequest.status === "accepted") {
			return res.status(200).json({ msg: "Already joined", joinGroupRequest });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const cancelJoinGroupRequest = async (req, res) => {
	try {
		const { requestorId, groupId } = req.body;

		const deletedJoinGroupRequest = await JoinGroupRequest.findOneAndDelete({
			requestorId: requestorId,
			groupId: groupId,
		});

		if (!deletedJoinGroupRequest) {
			return res.status(400).json({ msg: "Fail to remove join group request" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const acceptJoinGroupRequest = async (req, res) => {
	try {
		const { requestorId, groupId } = req.body;

		const updatedJoinGroupRequest = await JoinGroupRequest.findOneAndUpdate(
			{
				requestorId: requestorId,
				groupId: groupId,
			},
			{ $set: { status: "accepted" } }
		);

		if (!updatedJoinGroupRequest) {
			return res.status(400).json({ msg: "Fail to accept join group request" });
		}

		const updatedUser = await User.findByIdAndUpdate(requestorId, {
			$set: { [`groups.${groupId}`]: true },
		});

		if (!updatedUser) {
			return res.status(400).json({ msg: "Fail to accept join group request" });
		}

		const updatedGroup = await Group.findByIdAndUpdate(groupId, {
			$set: { [`members.${requestorId}`]: true },
		});

		if (!updatedGroup) {
			return res.status(400).json({ msg: "Fail to accept join group request" });
		}

		res.status(200).json({
			msg: "Success",
			joinGroupRequestId: updatedJoinGroupRequest._id,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const rejectJoinGroupRequest = async (req, res) => {
	try {
		const { requestorId, groupId } = req.body;

		const deletedJoinGroupRequest = await JoinGroupRequest.findOneAndDelete({
			requestorId: requestorId,
			groupId: groupId,
		});

		if (!deletedJoinGroupRequest) {
			return res.status(400).json({ msg: "Fail to reject join group request" });
		}

		res.status(200).json({
			msg: "Success",
			joinGroupRequestId: deletedJoinGroupRequest._id,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getNumberJoinGroupRequests = async (req, res) => {
	try {
		const { groupId } = req.query;

		const joinGroupRequests = await JoinGroupRequest.find({
			groupId: groupId,
			status: "pending",
		});

		res.status(200).json({
			msg: "Success",
			numberJoinGroupRequest: joinGroupRequests.length,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
