import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		eventName: {
			type: String,
			required: true,
			min: 3,
			max: 50,
		},
		eventDescription: {
			type: String,
			required: true,
			min: 1,
			max: 200,
		},
		eventPosterImagePath: {
			type: String,
			default: "",
			required: true,
		},
		eventVenue: {
			type: String,
			required: true,
			min: 1,
			max: 50,
		},
		isOneDayEvent: {
			type: Boolean,
			default: false,
		},
		eventStartDate: {
			type: String,
			default: "",
		},
		eventEndDate: {
			type: String,
			default: "",
		},
		eventOneDate: {
			type: String,
			default: "",
		},
		eventStartTime: {
			type: String,
			default: "",
		},
		eventEndTime: {
			type: String,
			default: "",
		},
		contactNumbers: {
			type: Array,
			required: true,
		},
		eventOrganizer: {
			type: String,
			required: true,
			min: 1,
			max: 50,
		},
		removed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
