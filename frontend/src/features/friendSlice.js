import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	numberOfFriends: 0,
	originalFriendsArr: [],
	friendsArr: [],
	isLoadingFriend: false,
	friendRequestsArr: [],
	randomFriendsArr: [],
	originalRandomFriendsArr: [],
	hasRandomFriends: true,
	pendingsArr: [],
};

const friendSlice = createSlice({
	name: "friend",
	initialState,
	reducers: {
		setNumberOfFriends: (state, action) => {
			state.numberOfFriends = action.payload;
		},
		setFriendsArr: (state, action) => {
			state.friendsArr = action.payload;
		},
		setOriginalFriendsArr: (state, action) => {
			state.originalFriendsArr = action.payload;
		},
		resetState: (state) => {
			state.numberOfFriends = 0;
			state.friendsArr = [];
			state.isLoadingFriend = false;
			state.originalFriendsArr = [];
			state.friendRequestsArr = [];
			state.randomFriendsArr = [];
			state.hasRandomFriends = true;
			state.originalRandomFriendsArr = [];
			state.pendingsArr = [];
		},
		setIsLoadingFriend: (state, action) => {
			state.isLoadingFriend = action.payload;
		},
		setFriendRequestsArr: (state, action) => {
			state.friendRequestsArr = action.payload;
		},
		removeFriendRequest: (state, action) => {
			state.friendRequestsArr = state.friendRequestsArr.filter(
				(friendRequest) => friendRequest._id !== action.payload
			);
		},
		removeFriend: (state, action) => {
			state.friendsArr = action.payload;
			state.originalFriendsArr = action.payload;
			state.numberOfFriends = action.payload.length;
		},
		setRandomFriendsArr: (state, action) => {
			state.randomFriendsArr = action.payload;
		},
		addRandomFriendsArr: (state, action) => {
			state.randomFriendsArr = [...state.randomFriendsArr, ...action.payload];
		},
		setHasRandomFriends: (state, action) => {
			state.hasRandomFriends = action.payload;
		},
		setOriginalRandomFriendsArr: (state, action) => {
			state.originalRandomFriendsArr = action.payload;
		},
		addOriginalRandomFriensArr: (state, action) => {
			state.originalRandomFriendsArr = [
				...state.originalRandomFriendsArr,
				...action.payload,
			];
		},
		setPendingsArr: (state, action) => {
			state.pendingsArr = action.payload;
		},
	},
});

export const {
	setNumberOfFriends,
	setFriendsArr,
	setOriginalFriendsArr,
	resetState,
	setIsLoadingFriend,
	setFriendRequestsArr,
	removeFriendRequest,
	removeFriend,
	setRandomFriendsArr,
	addRandomFriendsArr,
	setHasRandomFriends,
	setOriginalRandomFriendsArr,
	addOriginalRandomFriensArr,
	setPendingsArr,
} = friendSlice.actions;

export default friendSlice.reducer;
