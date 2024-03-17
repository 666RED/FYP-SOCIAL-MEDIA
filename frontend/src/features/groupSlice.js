import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	groupsArr: [],
	originalGroupsArr: [],
	randomGroupsArr: [],
	isLoadingGroups: false,
	hasGroups: true,
};

const groupSlice = createSlice({
	name: "group",
	initialState,
	reducers: {
		setGroupsArr: (state, action) => {
			state.groupsArr = action.payload;
		},
		setOriginalGroupsArr: (state, action) => {
			state.originalGroupsArr = action.payload;
		},
		setRandomGroupsArr: (state, action) => {
			state.randomGroupsArr = action.payload;
		},
		resetState: (state) => {
			state.groupsArr = [];
			state.originalGroupsArr = [];
			state.randomGroupsArr = [];
			state.isLoadingGroups = false;
			state.hasGroups = true;
		},
		setIsLoadingGroups: (state, action) => {
			state.isLoadingGroups = action.payload;
		},
		setHasGroups: (state, action) => {
			state.hasGroups = action.payload;
		},
		appendGroups: (state, action) => {
			state.groupsArr = [...state.groupsArr, ...action.payload];
		},
	},
});

export const {
	setGroupsArr,
	setOriginalGroupsArr,
	setRandomGroupsArr,
	resetState,
	setIsLoadingGroups,
	setHasGroups,
	appendGroups,
} = groupSlice.actions;

export default groupSlice.reducer;
