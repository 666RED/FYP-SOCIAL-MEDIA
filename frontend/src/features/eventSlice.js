import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	eventsArr: [],
	originalEventsArr: [],
	isLoadingEvents: false,
	hasEvents: true,
	eventCategory: "all",
};

const eventSlice = createSlice({
	name: "event",
	initialState,
	reducers: {
		setEventsArr: (state, action) => {
			state.eventsArr = action.payload;
		},
		addEventsArr: (state, action) => {
			state.eventsArr = [...state.eventsArr, ...action.payload];
		},
		setOriginalEventsArr: (state, action) => {
			state.originalEventsArr = action.payload;
		},
		setHasEvents: (state, action) => {
			state.hasEvents = action.payload;
		},
		setIsLoadingEvents: (state, action) => {
			state.isLoadingEvents = action.payload;
		},
		setEventCategory: (state, action) => {
			state.eventCategory = action.payload;
		},
		resetState: (state) => {
			state.eventsArr = [];
			state.originalEventsArr = [];
			state.isLoadingEvents = false;
			state.hasEvents = true;
			state.eventCategory = "all";
		},
	},
});

export const {
	setEventsArr,
	addEventsArr,
	setHasEvents,
	setOriginalEventsArr,
	setIsLoadingEvents,
	setEventCategory,
	resetState,
} = eventSlice.actions;

export default eventSlice.reducer;
