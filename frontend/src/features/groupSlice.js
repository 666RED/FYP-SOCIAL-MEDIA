import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	groupsArr: [],
	originalGroupsArr: [],
	randomGroupsArr: [],
	originalRandomGroupsArr: [],
	isLoadingGroups: false,
	isLoadingPosts: false,
	hasGroups: true,
	hasPosts: true,
	hasJoinGroupRequest: false,
	joinGroupRequestsArr: [],
	isLoadingJoinGroupRequests: false,
	isMember: false,
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
			state.originalRandomGroupsArr = [];
			state.isLoadingGroups = false;
			state.hasGroups = true;
			state.hasPosts = true;
			state.hasJoinGroupRequest = false;
			state.isLoadingPosts = false;
			state.joinGroupRequestsArr = [];
			state.isLoadingJoinGroupRequests = false;
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
		appendRandomGroups: (state, action) => {
			state.randomGroupsArr = [...state.randomGroupsArr, ...action.payload];
		},
		setOriginalRandomGroupsArr: (state, action) => {
			state.originalRandomGroupsArr = action.payload;
		},
		setHasPosts: (state, action) => {
			state.hasPosts = action.payload;
		},
		setIsLoadingPosts: (state, action) => {
			state.isLoadingPosts = action.payload;
		},
		setJoinGroupRequestsArr: (state, action) => {
			state.joinGroupRequestsArr = action.payload;
		},
		removeJoinGroupRequest: (state, action) => {
			state.joinGroupRequestsArr = state.joinGroupRequestsArr.filter(
				(joinGroupRequest) => joinGroupRequest._id !== action.payload
			);
		},
		setHasJoinGroupRequest: (state, action) => {
			state.hasJoinGroupRequest = action.payload;
		},
		setIsLoadingJoinGroupRequests: (state, action) => {
			state.isLoadingJoinGroupRequests = action.payload;
		},
		appendJoinGroupRequests: (state, action) => {
			state.joinGroupRequestsArr = [
				...state.joinGroupRequestsArr,
				...action.payload,
			];
		},
		setIsMember: (state, action) => {
			state.isMember = action.payload;
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
	appendRandomGroups,
	setOriginalRandomGroupsArr,
	setHasPosts,
	setIsLoadingPosts,
	setJoinGroupRequestsArr,
	removeJoinGroupRequest,
	setHasJoinGroupRequest,
	setIsLoadingJoinGroupRequests,
	appendJoinGroupRequests,
	setIsMember,
} = groupSlice.actions;

export default groupSlice.reducer;
