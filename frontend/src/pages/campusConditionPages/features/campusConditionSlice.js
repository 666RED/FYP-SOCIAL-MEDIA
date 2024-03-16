import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	mostUsefulConditions: [], // store objects
	center: {},
	selected: {},
	viewMode: false,
	campusConditions: [],
	hasConditionLocationChanged: false,
};

const campusConditionSlice = createSlice({
	name: "campusCondition",
	initialState,
	reducers: {
		// MOST USEFUL POSTS
		setMostUsefulConditions: (state, action) => {
			state.mostUsefulConditions = action.payload;
		},
		updateMostUsefulCondition: (state, action) => {
			state.mostUsefulConditions = state.mostUsefulConditions.map((condition) =>
				condition._id === action.payload._id ? action.payload : condition
			);
		},
		removeMostUsefulCondition: (state, action) => {
			state.mostUsefulConditions = state.mostUsefulConditions.filter(
				(condition) => condition._id !== action.payload._id
			);
		},
		// GOOGLE MAP
		changeLocation: (state, action) => {
			const { location } = action.payload;

			state.center = location;
			state.selected = location;
			state.hasConditionLocationChanged = true;
		},
		loadCurrentLocation: (state, action) => {
			const { location } = action.payload;
			state.center = location;
			state.selected = location;
			state.viewMode = false;
		},
		loadMap: (state, action) => {
			state.center = action.payload;
			state.selected = action.payload;
			state.viewMode = true;
		},
		// CAMPUS CONDITIONS
		setCampusConditions: (state, action) => {
			state.campusConditions = action.payload;
		},
		setHasConditionLocationChanged: (state, action) => {
			state.hasConditionLocationChanged = action.payload;
		},
		updateCampusCondition: (state, action) => {
			state.campusConditions = state.campusConditions.map((condition) =>
				condition._id === action.payload._id ? action.payload : condition
			);
		},
		removeCampusCondition: (state, action) => {
			state.campusConditions = state.campusConditions.filter(
				(condition) => condition._id !== action.payload._id
			);
		},
		appendCampusConditions: (state, action) => {
			state.campusConditions = [...state.campusConditions, ...action.payload];
		},
	},
});

export const {
	setMostUsefulConditions,
	updateMostUsefulCondition,
	removeMostUsefulCondition,
	changeLocation,
	loadCurrentLocation,
	setCampusConditions,
	loadMap,
	setHasConditionLocationChanged,
	updateCampusCondition,
	removeCampusCondition,
	appendCampusConditions,
} = campusConditionSlice.actions;

export default campusConditionSlice.reducer;
