import mongoose from "mongoose";
import { Event } from "../models/eventModel.js";
import { User } from "../models/userModel.js";
import { uploadFile, deleteFile } from "../middleware/handleFile.js";

export const createNewEvent = async (req, res) => {
	try {
		const {
			name,
			description,
			venue,
			contactNumbers,
			userId,
			isOneDayEvent,
			organizer,
		} = req.body;

		const numbers = JSON.parse(contactNumbers);
		const image = req.file;

		let newEvent;

		const imageURL = await uploadFile("event/", image);

		if (isOneDayEvent === "true") {
			const { oneDate, startTime, endTime } = req.body;

			newEvent = new Event({
				eventName: name,
				eventDescription: description,
				eventPosterImagePath: imageURL,
				eventVenue: venue,
				isOneDayEvent: isOneDayEvent,
				userId,
				contactNumbers: numbers,
				eventOneDate: oneDate,
				eventStartTime: startTime,
				eventEndTime: endTime,
				eventOrganizer: organizer,
			});
		} else {
			const { startDate, endDate } = req.body;

			newEvent = new Event({
				eventName: name,
				eventDescription: description,
				eventPosterImagePath: imageURL,
				eventVenue: venue,
				isOneDayEvent: isOneDayEvent,
				userId,
				contactNumbers: numbers,
				eventStartDate: startDate,
				eventEndDate: endDate,
				eventOrganizer: organizer,
			});
		}

		const savedEvent = await newEvent.save();

		if (!savedEvent) {
			return res.status(400).json({ msg: "Fail to create new event" });
		}

		res.status(201).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getEvent = async (req, res) => {
	try {
		const { id } = req.query;
		const event = await Event.findById(id);

		if (!event) {
			return res.status(404).json({ msg: "Event not found" });
		}

		const user = await User.findById(event.userId);

		let userName = "";
		let userProfileImagePath = "";
		let frameColor = "";

		if (user) {
			userName = user.userName;
			userProfileImagePath = user.userProfile.profileImagePath;
			frameColor = user.userProfile.profileFrameColor;
		}

		const { __v, ...rest } = event._doc;

		res.status(200).json({
			msg: "Success",
			event: { ...rest, userName, userProfileImagePath, frameColor },
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getEvents = async (req, res) => {
	try {
		const { category } = req.query;

		const eventIds = JSON.parse(req.query.eventIds);

		let events;

		if (category === "all") {
			events = await Event.aggregate([
				{
					$match: {
						$and: [
							{ removed: false },
							{
								_id: {
									$nin: eventIds.map((id) => new mongoose.Types.ObjectId(id)),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else if (category === "one-day") {
			events = await Event.aggregate([
				{
					$match: {
						$and: [
							{ removed: false },
							{ isOneDayEvent: true },
							{
								_id: {
									$nin: eventIds.map((id) => new mongoose.Types.ObjectId(id)),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
				{ $sort: { createdAt: -1 } },
			]);
		} else {
			events = await Event.aggregate([
				{
					$match: {
						$and: [
							{ removed: false },
							{ isOneDayEvent: false },
							{
								_id: {
									$nin: eventIds.map((id) => new mongoose.Types.ObjectId(id)),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		}

		if (!events) {
			return res.status(404).json({ msg: "Events not found" });
		}

		const returnEvents = events.map((event) => {
			const { eventDescription, __v, removed, ...rest } = event;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnEvents });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMyEvents = async (req, res) => {
	try {
		const { userId, category } = req.query;

		const eventIds = JSON.parse(req.query.eventIds);

		let events;

		if (category === "all") {
			events = await Event.aggregate([
				{
					$match: {
						$and: [
							{ userId: new mongoose.Types.ObjectId(userId) },
							{ removed: false },
							{
								_id: {
									$nin: eventIds.map((id) => new mongoose.Types.ObjectId(id)),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else if (category === "one-day") {
			events = await Event.aggregate([
				{
					$match: {
						$and: [
							{ userId: new mongoose.Types.ObjectId(userId) },
							{ removed: false },
							{ isOneDayEvent: true },
							{
								_id: {
									$nin: eventIds.map((id) => new mongoose.Types.ObjectId(id)),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else {
			events = await Event.aggregate([
				{
					$match: {
						$and: [
							{ userId: new mongoose.Types.ObjectId(userId) },
							{ removed: false },
							{ isOneDayEvent: false },
							{
								_id: {
									$nin: eventIds.map((id) => new mongoose.Types.ObjectId(id)),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		}

		if (!events) {
			return res.status(404).json({ msg: "Events not found" });
		}

		const returnEvents = events.map((event) => {
			const { eventDescription, __v, removed, ...rest } = event;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnEvents });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedEvents = async (req, res) => {
	try {
		const { searchText, category } = req.query;
		const limit = 15;
		const eventIds = JSON.parse(req.query.eventIds);

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const excludedEvents = eventIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		let events;

		if (category === "all") {
			events = await Event.aggregate([
				{
					$match: {
						_id: { $nin: excludedEvents },
						removed: false,
						eventName: { $regex: searchText, $options: "i" },
					},
				},
				{
					$limit: limit,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else if (category === "one-day") {
			events = await Event.aggregate([
				{
					$match: {
						_id: { $nin: excludedEvents },
						removed: false,
						eventName: { $regex: searchText, $options: "i" },
						isOneDayEvent: true,
					},
				},
				{
					$limit: limit,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else {
			events = await Event.aggregate([
				{
					$match: {
						_id: { $nin: excludedEvents },
						removed: false,
						eventName: { $regex: searchText, $options: "i" },
						isOneDayEvent: false,
					},
				},
				{
					$limit: limit,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		}

		if (!events) {
			return res.status(400).json({ msg: "Fail to retrieve events" });
		}

		const returnEvents = events.map((event) => {
			const { eventDescription, __v, removed, ...rest } = event;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnEvents });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedMyEvents = async (req, res) => {
	try {
		const { userId, searchText, category } = req.query;
		const limit = 15;
		const eventIds = JSON.parse(req.query.eventIds);

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const excludedEvents = eventIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		let events;

		if (category === "all") {
			events = await Event.aggregate([
				{
					$match: {
						_id: { $nin: excludedEvents },
						userId: new mongoose.Types.ObjectId(userId),
						removed: false,
						eventName: { $regex: searchText, $options: "i" },
					},
				},
				{
					$limit: limit,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else if (category === "one-day") {
			events = await Event.aggregate([
				{
					$match: {
						_id: { $nin: excludedEvents },
						userId: new mongoose.Types.ObjectId(userId),
						removed: false,
						eventName: { $regex: searchText, $options: "i" },
						isOneDayEvent: true,
					},
				},
				{
					$limit: limit,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		} else {
			events = await Event.aggregate([
				{
					$match: {
						_id: { $nin: excludedEvents },
						userId: new mongoose.Types.ObjectId(userId),
						removed: false,
						eventName: { $regex: searchText, $options: "i" },
						isOneDayEvent: false,
					},
				},
				{
					$limit: limit,
				},
				{
					$sort: { createdAt: -1 },
				},
			]);
		}

		if (!events) {
			return res.status(400).json({ msg: "Fail to retrieve events" });
		}

		const returnEvents = events.map((event) => {
			const { eventDescription, __v, removed, ...rest } = event;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnEvents });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editEvent = async (req, res) => {
	try {
		const {
			eventId,
			name,
			description,
			venue,
			contactNumbers,
			isOneDayEvent,
			organizer,
		} = req.body;

		const numbers = JSON.parse(contactNumbers);

		const image = req.file;

		const originalEvent = await Event.findById(eventId);
		const originalEventPosterImagePath = originalEvent.eventPosterImagePath;

		let updatedEvent;

		// update image
		if (image) {
			const imageURL = await uploadFile("event/", image);
			if (isOneDayEvent === "true") {
				const { oneDate, startTime, endTime } = req.body;
				updatedEvent = await Event.findByIdAndUpdate(eventId, {
					$set: {
						eventName: name,
						eventDescription: description,
						eventPosterImagePath: imageURL,
						eventVenue: venue,
						isOneDayEvent: isOneDayEvent,
						contactNumbers: numbers,
						eventOneDate: oneDate,
						eventStartTime: startTime,
						eventEndTime: endTime,
						eventOrganizer: organizer,
						eventStartDate: "",
						eventEndDate: "",
					},
				});
			} else {
				const { startDate, endDate } = req.body;
				updatedEvent = await Event.findByIdAndUpdate(eventId, {
					$set: {
						eventName: name,
						eventDescription: description,
						eventPosterImagePath: imageURL,
						eventVenue: venue,
						isOneDayEvent: isOneDayEvent,
						contactNumbers: numbers,
						eventStartDate: startDate,
						eventEndDate: endDate,
						eventOrganizer: organizer,
						eventOneDate: "",
						eventStartTime: "",
						eventEndTime: "",
					},
				});
			}
		} else {
			if (isOneDayEvent === "true") {
				const { oneDate, startTime, endTime } = req.body;
				updatedEvent = await Event.findByIdAndUpdate(eventId, {
					$set: {
						eventName: name,
						eventDescription: description,
						eventVenue: venue,
						isOneDayEvent: isOneDayEvent,
						contactNumbers: numbers,
						eventOneDate: oneDate,
						eventStartTime: startTime,
						eventEndTime: endTime,
						eventOrganizer: organizer,
						eventStartDate: "",
						eventEndDate: "",
					},
				});
			} else {
				const { startDate, endDate } = req.body;
				updatedEvent = await Event.findByIdAndUpdate(eventId, {
					$set: {
						eventName: name,
						eventDescription: description,
						eventVenue: venue,
						isOneDayEvent: isOneDayEvent,
						contactNumbers: numbers,
						eventStartDate: startDate,
						eventEndDate: endDate,
						eventOrganizer: organizer,
						eventOneDate: "",
						eventStartTime: "",
						eventEndTime: "",
					},
				});
			}
		}

		if (!updatedEvent) {
			return res.status(400).json({ msg: "Fail to edit event" });
		}

		// remove original image
		if (image) {
			await deleteFile(originalEventPosterImagePath);
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeEvent = async (req, res) => {
	try {
		const { eventId } = req.body;

		const originalEvent = await Event.findById(eventId);

		if (!originalEvent) {
			return res.status(400).json({ msg: "Fail to remove event" });
		}

		const removedEvent = await Event.findByIdAndUpdate(eventId, {
			$set: { removed: true },
		});

		if (!removedEvent) {
			return res.status(400).json({ msg: "Fail to remove event" });
		}

		// remove image
		await deleteFile(originalEvent.eventPosterImagePath);

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
