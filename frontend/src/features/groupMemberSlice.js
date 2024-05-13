import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoadingMembers: false,
	membersArr: [],
	originalMembersArr: [],
	numberOfMembers: 0,
	hasMembers: false,
};

const groupMemberSlice = createSlice({
	name: "groupMember",
	initialState,
	reducers: {
		resetGroupMemberState: (state) => {
			state.membersArr = [];
			state.originalMembersArr = [];
			state.numberOfMembers = 0;
		},
		firstRenderViewMembers: (state, action) => {
			const { returnMembersArr, numberOfMembers } = action.payload;
			state.membersArr = returnMembersArr;
			state.originalMembersArr = returnMembersArr;
			state.numberOfMembers = numberOfMembers;
		},
		setMembersArr: (state, action) => {
			state.membersArr = action.payload;
		},
		setOriginalMembersArr: (state, action) => {
			state.originalMembersArr = action.payload;
		},
		setIsLoadingMembers: (state, action) => {
			state.isLoadingMembers = action.payload;
		},
		setNumberOfMembers: (state, action) => {
			state.numberOfMembers = action.payload;
		},
		setHasMembers: (state, action) => {
			state.hasMembers = action.payload;
		},
		appendMembers: (state, action) => {
			state.membersArr = [...state.membersArr, ...action.payload];
		},
		removeMember: (state, action) => {
			state.membersArr = state.membersArr.filter(
				(member) => member._id !== action.payload
			);
		},
	},
});

export const {
	resetGroupMemberState,
	firstRenderViewMembers,
	setMembersArr,
	setOriginalMembersArr,
	setIsLoadingMembers,
	setNumberOfMembers,
	setHasMembers,
	appendMembers,
	removeMember,
} = groupMemberSlice.actions;

export default groupMemberSlice.reducer;
