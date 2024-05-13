import mongoose from "mongoose";

const campusConditionSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		conditionTitle: {
			type: String,
			required: true,
			max: 50,
		},
		conditionDescription: {
			type: String,
			required: true,
			max: 200,
		},
		conditionImagePath: {
			type: String,
			default: "",
		},
		conditionUp: {
			type: Number,
			default: 0,
		},
		conditionUpMaps: {
			type: Map,
			of: Boolean,
			default: new Map(),
		},
		conditionDown: {
			type: Number,
			default: 0,
		},
		conditionDownMaps: {
			type: Map,
			of: Boolean,
			default: new Map(),
		},
		conditionResolved: {
			type: Boolean,
			default: false,
		},
		conditionLocation: {
			locationLatitude: {
				type: String,
			},
			locationLongitude: {
				type: String,
			},
		},
		removed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const CampusCondition = mongoose.model(
	"Campus-Condition",
	campusConditionSchema
);
