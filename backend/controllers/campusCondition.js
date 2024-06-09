import { CampusCondition } from "../models/campusConditionModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import { formatDateTime } from "../usefulFunction.js";
import { uploadFile, deleteFile } from "../middleware/handleFile.js";
import {
	deleteRate,
	deleteRates,
	markCondition,
	rateCondition,
} from "../API/firestoreAPI.js";

export const addNewCampusCondition = async (req, res) => {
	try {
		const { title, description, latitude, longitude, userId } = req.body;

		const image = req.file;

		let newCampusCondition;

		if (image) {
			const imageURL = await uploadFile("campus-condition/", image);
			newCampusCondition = new CampusCondition({
				userId,
				conditionTitle: title,
				conditionDescription: description,
				conditionImagePath: imageURL,
				conditionLocation: {
					locationLatitude: latitude,
					locationLongitude: longitude,
				},
			});
		} else {
			newCampusCondition = new CampusCondition({
				userId,
				conditionTitle: title,
				conditionDescription: description,
				conditionLocation: {
					locationLatitude: latitude,
					locationLongitude: longitude,
				},
			});
		}

		const savedCampusCondition = await newCampusCondition.save();

		if (!savedCampusCondition) {
			return res.status(400).json({ msg: "Fail to upload new condition" });
		}

		res.status(201).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getCampusConditions = async (req, res) => {
	try {
		const limit = 10;
		const currentTime = req.query.currentTime
			? new Date(req.query.currentTime)
			: new Date();

		const conditionIds = JSON.parse(req.query.conditionIds);

		const campusConditions = await CampusCondition.aggregate([
			{
				$match: {
					createdAt: { $lt: currentTime },
					removed: false,
					_id: {
						$nin: conditionIds.map((id) => new mongoose.Types.ObjectId(id)),
					},
				},
			},
			{
				$sort: { createdAt: -1 },
			},
			{
				$limit: limit,
			},
		]);

		if (!campusConditions) {
			return res.status(404).json({ msg: "Campus conditions not found" });
		}

		const userIds = campusConditions.map((condition) => condition.userId);

		// Fetch users related to these conditions
		const users = await User.find({ _id: { $in: userIds } }).select(
			"userName userProfile.profileImagePath userProfile.profileFrameColor"
		);

		// Map user details to conditions
		const formattedConditions = campusConditions.map((condition) => {
			const user = users.find((user) => user._id.equals(condition.userId));
			const userName = user ? user.userName : "";
			const profileImagePath = user ? user.userProfile.profileImagePath : "";
			const frameColor = user ? user.userProfile.profileFrameColor : "";

			return {
				...condition,
				userName,
				profileImagePath,
				time: formatDateTime(condition.createdAt),
				frameColor,
			};
		});

		// Exclude unnecessary fields
		const returnConditions = formattedConditions.map((condition) => {
			const { createdAt, updatedAt, __v, removed, ...rest } = condition;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnConditions });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getYourCampusConditions = async (req, res) => {
	try {
		const limit = 10;
		const currentTime = req.query.currentTime
			? new Date(req.query.currentTime)
			: new Date();
		const userId = req.query.userId;

		const conditionIds = JSON.parse(req.query.conditionIds);

		const campusConditions = await CampusCondition.aggregate([
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
					createdAt: { $lt: currentTime },
					removed: false,
					_id: {
						$nin: conditionIds.map((id) => new mongoose.Types.ObjectId(id)),
					},
				},
			},
			{
				$sort: { createdAt: -1 },
			},
			{
				$limit: limit,
			},
		]);

		if (!campusConditions) {
			return res.status(404).json({ msg: "Campus conditions not found" });
		}

		const userIds = campusConditions.map((condition) => condition.userId);

		const users = await User.find({ _id: { $in: userIds } }).select(
			"userName userProfile.profileImagePath userProfile.profileFrameColor"
		);

		const formattedConditions = campusConditions.map((condition) => {
			const user = users.find((user) => user._id.equals(condition.userId));
			const userName = user ? user.userName : "";
			const profileImagePath = user ? user.userProfile.profileImagePath : "";
			const frameColor = user ? user.userProfile.profileFrameColor : "";

			return {
				...condition,
				userName,
				profileImagePath,
				time: formatDateTime(condition.createdAt),
				frameColor,
			};
		});

		const returnConditions = formattedConditions.map((condition) => {
			const { createdAt, updatedAt, __v, removed, ...rest } = condition;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnConditions });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const handleUp = async (req, res) => {
	try {
		const { conditionId, userId, isDown } = req.body;

		const condition = await CampusCondition.findById(conditionId);

		if (!condition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		condition.conditionUpMaps.set(userId, true);
		condition.conditionDownMaps.delete(userId, true);

		const decrementDown = isDown ? -1 : 0;

		const updatedCondition = await CampusCondition.findOneAndUpdate(
			{ _id: conditionId },
			{
				$inc: { conditionUp: 1, conditionDown: decrementDown },
				$set: {
					conditionUpMaps: condition.conditionUpMaps,
					conditionDownMaps: condition.conditionDownMaps,
				},
			},
			{ new: true } // Return the updated document
		);

		if (!updatedCondition) {
			return res.status(404).json({ msg: "Condition not updated" });
		}

		// firebase
		if (userId !== updatedCondition.userId.toString()) {
			const isEdit = isDown;
			const rateUp = true;
			const postUserId = condition.userId.toString();
			const user = await User.findById(userId);
			const userName = user.userName;

			await rateCondition({
				userId,
				conditionId,
				postUserId,
				isEdit,
				rateUp,
				userName,
			});
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const cancelUp = async (req, res) => {
	try {
		const { conditionId, userId } = req.body;

		const condition = await CampusCondition.findById(conditionId);

		if (!condition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		condition.conditionUpMaps.delete(userId, true);

		const updatedCondition = await CampusCondition.findOneAndUpdate(
			{ _id: conditionId },
			{
				$inc: { conditionUp: -1 },
				$set: { conditionUpMaps: condition.conditionUpMaps },
			},
			{ new: true } // Return the updated document
		);

		if (!updatedCondition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		// firebase
		if (userId !== updatedCondition.userId.toString()) {
			await deleteRate({ userId, conditionId });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const handleDown = async (req, res) => {
	try {
		const { conditionId, userId, isUp } = req.body;

		const condition = await CampusCondition.findById(conditionId);

		if (!condition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		condition.conditionUpMaps.delete(userId, true);
		condition.conditionDownMaps.set(userId, true);

		const decrementUp = isUp ? -1 : 0;

		const updatedCondition = await CampusCondition.findOneAndUpdate(
			{ _id: conditionId },
			{
				$inc: { conditionDown: 1, conditionUp: decrementUp },
				$set: {
					conditionDownMaps: condition.conditionDownMaps,
					conditionUpMaps: condition.conditionUpMaps,
				},
			},
			{ new: true } // Return the updated document
		);

		if (!updatedCondition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		// firebase
		if (userId !== updatedCondition.userId.toString()) {
			const isEdit = isUp;
			const rateUp = false;
			const postUserId = condition.userId.toString();
			const user = await User.findById(userId);
			const userName = user.userName;

			await rateCondition({
				userId,
				conditionId,
				postUserId,
				isEdit,
				rateUp,
				userName,
			});
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const cancelDown = async (req, res) => {
	try {
		const { conditionId, userId } = req.body;

		const condition = await CampusCondition.findById(conditionId);

		if (!condition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		condition.conditionDownMaps.delete(userId, true);

		const updatedCondition = await CampusCondition.findOneAndUpdate(
			{ _id: conditionId },
			{
				$inc: { conditionDown: -1 },
				$set: { conditionDownMaps: condition.conditionDownMaps },
			},
			{ new: true } // Return the updated document
		);

		if (!updatedCondition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		// firebase
		if (userId !== updatedCondition.userId.toString()) {
			await deleteRate({ userId, conditionId });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editCondition = async (req, res) => {
	try {
		const {
			campusConditionId,
			conditionTitle,
			conditionDescription,
			conditionImagePath,
			locationLatitude,
			locationLongitude,
		} = req.body;

		const conditionImage = req.file;

		const originalCondition = await CampusCondition.findById(campusConditionId);

		let updatedCondition;

		const removeImage =
			conditionImagePath === "" && originalCondition.conditionImagePath !== "";

		const originalConditionImagePath = originalCondition.conditionImagePath;

		// upload image
		if (conditionImage || removeImage) {
			const imageURL = removeImage
				? ""
				: await uploadFile("campus-condition/", conditionImage);

			updatedCondition = await CampusCondition.findByIdAndUpdate(
				campusConditionId,
				{
					$set: {
						conditionDescription,
						conditionTitle,
						conditionLocation: { locationLatitude, locationLongitude },
						conditionImagePath: imageURL,
					},
				},
				{ new: true }
			);
		} else {
			// without upload image
			updatedCondition = await CampusCondition.findByIdAndUpdate(
				campusConditionId,
				{
					$set: {
						conditionDescription,
						conditionTitle,
						conditionLocation: { locationLatitude, locationLongitude },
					},
				},
				{ new: true }
			);
		}

		if (!updatedCondition) {
			return res.status(400).json({ msg: "Fail to edit condition" });
		}

		const user = await User.findById(updatedCondition.userId);
		let profileImagePath = "";
		let userName = "";
		let frameColor = "";

		if (user) {
			profileImagePath = user.userProfile.profileImagePath;
			userName = user.userName;
			frameColor = user.userProfile.profileFrameColor;
		}

		const { createdAt, updatedAt, __v, removed, ...rest } =
			updatedCondition._doc;

		// remove image
		if ((conditionImage && originalConditionImagePath !== "") || removeImage) {
			await deleteFile(originalConditionImagePath);
		}

		res.status(200).json({
			msg: "Success",
			returnCondition: {
				...rest,
				profileImagePath,
				userName,
				time: formatDateTime(updatedCondition.createdAt),
				frameColor,
				type: "Condition",
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteCondition = async (req, res) => {
	try {
		const { conditionId } = req.body;

		const deletedCondition = await CampusCondition.findByIdAndUpdate(
			conditionId,
			{
				$set: { removed: true },
			}
		);

		if (!deletedCondition) {
			return res.status(400).json({ msg: "Fail to delete condition" });
		}

		// remove image if got any
		if (deletedCondition.conditionImagePath !== "") {
			await deleteFile(deletedCondition.conditionImagePath);
		}

		// firebase
		const upMapIds = Array.from(deletedCondition.conditionUpMaps.keys()).map(
			(id) => id.toString()
		);
		const downMapIds = Array.from(
			deletedCondition.conditionDownMaps.keys()
		).map((id) => id.toString());
		const userIds = [...upMapIds, ...downMapIds];

		await deleteRates({ userIds, conditionId });

		res.status(200).json({ msg: "Success", deletedCondition });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const updateConditionResolved = async (req, res) => {
	try {
		const { userId, campusConditionId, isConditionResolved } = req.body;

		const updatedCondition = await CampusCondition.findByIdAndUpdate(
			campusConditionId,
			{
				$set: {
					conditionResolved: !isConditionResolved,
				},
			},
			{ new: true }
		);

		if (!updatedCondition) {
			return res.status(404).json({ msg: "Fail to update condition" });
		}

		// firebase (for admin)
		if (updatedCondition.userId.toString() !== userId) {
			const conditionId = campusConditionId;
			const postUserId = updatedCondition.userId.toString();
			await markCondition({ userId, conditionId, postUserId });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getMostUsefulConditions = async (req, res) => {
	try {
		const limit = 5;
		const sevenDaysAgo = new Date(
			new Date().getTime() - 7 * 24 * 60 * 60 * 1000
		);

		let mostUsefulConditions = await CampusCondition.aggregate([
			{
				$match: {
					removed: false,
					conditionResolved: false,
					createdAt: { $gte: sevenDaysAgo },
				},
			},
			{
				$addFields: {
					upDownDifference: { $subtract: ["$conditionUp", "$conditionDown"] },
				},
			},
			{
				$sort: { upDownDifference: -1 }, // Sort in descending order by upDownDifference
			},
			{
				$limit: limit,
			},
		]);

		if (!mostUsefulConditions) {
			return res.status(404).json({ msg: "Conditions not found" });
		}

		mostUsefulConditions = mostUsefulConditions.map((condition) => {
			const { _id, conditionTitle, conditionUp, conditionDown } = condition;

			return {
				_id,
				conditionTitle,
				conditionUp,
				conditionDown,
				time: formatDateTime(condition.createdAt),
			};
		});

		res.status(200).json({ msg: "Success", mostUsefulConditions });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMostUsefulCondition = async (req, res) => {
	try {
		const { conditionId } = req.query;

		let returnCondition = await CampusCondition.findOne({
			_id: new mongoose.Types.ObjectId(conditionId),
		});

		if (!returnCondition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		const user = await User.findById(returnCondition.userId);
		let profileImagePath = "";
		let userName = user.userName;
		let frameColor = "";

		if (user) {
			profileImagePath = user.userProfile.profileImagePath;
			userName = user.userName;
			frameColor = user.userProfile.profileFrameColor;
		}

		const { createdAt, updatedAt, __v, removed, ...rest } =
			returnCondition._doc;

		res.status(200).json({
			msg: "Success",
			returnCondition: {
				...rest,
				profileImagePath,
				userName,
				time: formatDateTime(returnCondition.createdAt),
				frameColor,
			},
		});
	} catch (err) {}
};
