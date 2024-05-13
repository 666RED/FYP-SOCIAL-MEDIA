import path from "path";
import fs from "fs";
import { __dirname } from "../index.js";
import { CampusCondition } from "../models/campusConditionModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

export const addNewCampusCondition = async (req, res) => {
	try {
		const { title, description, latitude, longitude, userId } = req.body;

		const image = req.file;

		let newCampusCondition;

		if (image) {
			newCampusCondition = new CampusCondition({
				userId,
				conditionTitle: title,
				conditionDescription: description,
				conditionImagePath: image.filename,
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

		res.status(201).json({ msg: "Success", savedCampusCondition });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getCampusConditions = async (req, res) => {
	try {
		const limit = 10;
		const currentTime = new Date(req.query.currentTime) || new Date();
		const conditions = req.query.conditions;

		const conditionsArray = JSON.parse(conditions);

		const campusConditions = await CampusCondition.aggregate([
			{
				$addFields: {
					duration: {
						$divide: [
							{
								$subtract: [currentTime, "$createdAt"],
							},
							1000 * 3600, // convert milliseconds to seconds
						],
					},
				},
			},
			{
				$match: {
					createdAt: { $lt: currentTime },
					removed: false,
					_id: {
						$nin: conditionsArray.map(
							(condition) => new mongoose.Types.ObjectId(condition._id)
						),
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

		res.status(200).json({
			msg: "Success",
			returnConditions: campusConditions,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getUserInfo = async (req, res) => {
	try {
		const { userId } = req.body;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		res.status(200).json({
			msg: "Success",
			profileImagePath: user.userProfile.profileImagePath,
			userName: user.userName,
		});
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

		res.status(200).json({ msg: "Success" });
	} catch (err) {
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

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

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

		res.status(200).json({ msg: "Success" });
	} catch (err) {
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

		const originalCondition = await CampusCondition.findById(campusConditionId);

		const conditionImage = req.file;

		let updatedCondition;

		const removeImage =
			conditionImagePath === "" && originalCondition.conditionImagePath !== "";

		if (
			(conditionImage && originalCondition.conditionImagePath !== "") ||
			removeImage
		) {
			const conditionImagePath = path.join(
				__dirname,
				"public/images/campus-condition",
				originalCondition.conditionImagePath
			);
			fs.unlinkSync(conditionImagePath);
		}

		if (conditionImage || removeImage) {
			updatedCondition = await CampusCondition.findByIdAndUpdate(
				campusConditionId,
				{
					$set: {
						conditionDescription,
						conditionTitle,
						conditionLocation: { locationLatitude, locationLongitude },
						conditionImagePath: removeImage ? "" : conditionImage.filename,
					},
				},
				{ new: true }
			);
		} else {
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

		// add duration into it
		const updatedConditionWithDuration = await CampusCondition.aggregate([
			{
				$match: {
					_id: updatedCondition._id,
					removed: false,
				},
			},
			{
				$addFields: {
					duration: {
						$divide: [
							{
								$subtract: [new Date(), "$createdAt"],
							},
							1000 * 3600, // convert milliseconds to seconds
						],
					},
				},
			},
		]);

		const returnCondition = updatedConditionWithDuration[0];

		res.status(200).json({ msg: "Success", returnCondition });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteCondition = async (req, res) => {
	try {
		const { condition } = req.body;

		// remove image if got any
		if (condition.conditionImagePath !== "") {
			const conditionImagePath = path.join(
				__dirname,
				"public/images/campus-condition",
				condition.conditionImagePath
			);
			fs.unlinkSync(conditionImagePath);
		}

		const deletedCondition = await CampusCondition.findByIdAndUpdate(
			condition._id,
			{
				$set: { removed: true },
			}
		);

		if (!deletedCondition) {
			return res.status(400).json({ msg: "Fail to delete condition" });
		}

		res.status(200).json({ msg: "Success", deletedCondition });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const updateConditionResolved = async (req, res) => {
	try {
		const { campusConditionId } = req.body;

		const condition = await CampusCondition.findById(campusConditionId);

		if (!condition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		const reverseConditionResolved = !condition.conditionResolved;

		const updatedCondition = await CampusCondition.findByIdAndUpdate(
			campusConditionId,
			{
				$set: {
					conditionResolved: reverseConditionResolved,
				},
			},
			{ new: true }
		);

		if (!updatedCondition) {
			return res.status(404).json({ msg: "Fail to update condition" });
		}

		const updatedConditionWithDuration = await CampusCondition.aggregate([
			{
				$match: {
					_id: updatedCondition._id,
					removed: false,
				},
			},
			{
				$addFields: {
					duration: {
						$divide: [
							{
								$subtract: [new Date(), "$createdAt"],
							},
							1000 * 3600, // convert milliseconds to seconds
						],
					},
				},
			},
		]);

		const returnCondition = updatedConditionWithDuration[0];

		res.status(200).json({ msg: "Success", returnCondition });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMostUsefulConditions = async (req, res) => {
	try {
		const limit = 5;

		const mostUsefulConditions = await CampusCondition.aggregate([
			{
				$addFields: {
					upDownDifference: { $subtract: ["$conditionUp", "$conditionDown"] },
					duration: {
						$divide: [
							{
								$subtract: [new Date(), "$createdAt"],
							},
							1000 * 3600, // convert milliseconds to seconds
						],
					},
				},
			},
			{
				$match: {
					removed: false,
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

		res.status(200).json({ msg: "Success", mostUsefulConditions });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMostUsefulCondition = async (req, res) => {
	try {
		const { conditionId } = req.query;

		const returnCondition = await CampusCondition.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(conditionId),
					removed: false,
				},
			},
			{
				$addFields: {
					duration: {
						$divide: [
							{
								$subtract: [new Date(), "$createdAt"],
							},
							1000 * 3600, // convert milliseconds to seconds
						],
					},
				},
			},
		]);

		if (!returnCondition) {
			return res.status(404).json({ msg: "Condition not found" });
		}

		res
			.status(200)
			.json({ msg: "Success", returnCondition: returnCondition[0] });
	} catch (err) {
		console.log(err);
	}
};
