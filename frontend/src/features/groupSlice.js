import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	groupsArr: [],
	randomGroupsArr: [],
	isLoadingGroups: false,
};

const groupSlice = createSlice({
	name: "group",
	initialState,
	reducers: {
		setGroupsArr: (state, action) => {
			state.groupsArr = action.payload;
		},
		setRandomGroupsArr: (state, action) => {
			state.randomGroupsArr = action.payload;
		},
		resetState: (state) => {
			state.groupsArr = [];
			state.randomGroupsArr = [];
			state.isLoadingGroups = false;
		},
		setIsLoadingGroups: (state, action) => {
			state.isLoadingGroups = action.payload;
		},
	},
});

export const {
	setGroupsArr,
	setRandomGroupsArr,
	resetState,
	setIsLoadingGroups,
} = groupSlice.actions;

export default groupSlice.reducer;
