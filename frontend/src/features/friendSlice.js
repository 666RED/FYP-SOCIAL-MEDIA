import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// FRIEND
	numberOfFriends: 0,
	originalFriendsArr: [],
	friendsArr: [],
	isLoadingFriend: false,
	hasFriends: false,
	randomFriendsArr: [],
	originalRandomFriendsArr: [],
	hasRandomFriends: false,
	// FRIEND REQUEST
	friendRequestsArr: [],
	isLoadingFriendRequests: false,
	hasFriendRequests: false,
	// PENDING
	pendingsArr: [],
	isLoadingPendings: false,
	hasPendings: false,
};

const friendSlice = createSlice({
	name: "friend",
	initialState,
	reducers: {
		// FRIEND
		setNumberOfFriends: (state, action) => {
			state.numberOfFriends = action.payload;
		},
		setFriendsArr: (state, action) => {
			state.friendsArr = action.payload;
		},
		addFriendsArr: (state, action) => {
			state.friendsArr = [...state.friendsArr, ...action.payload];
		},
		setHasFriends: (state, action) => {
			state.hasFriends = action.payload;
		},
		setOriginalFriendsArr: (state, action) => {
			state.originalFriendsArr = action.payload;
		},
		setIsLoadingFriend: (state, action) => {
			state.isLoadingFriend = action.payload;
		},
		removeFriend: (state, action) => {
			state.friendsArr = action.payload;
			state.originalFriendsArr = action.payload;
			state.numberOfFriends = action.payload.length;
		},
		removeRandomFriend: (state, action) => {
			state.randomFriendsArr = state.randomFriendsArr.filter((friend) => {
				return friend._id !== action.payload;
			});
		},
		removeOriginalRandomFriend: (state, action) => {
			state.originalRandomFriendsArr = state.originalRandomFriendsArr.filter(
				(friend) => {
					return friend._id !== action.payload;
				}
			);
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
		// FRIEND REQUEST
		setFriendRequestsArr: (state, action) => {
			state.friendRequestsArr = action.payload;
		},
		addFriendRequestsArr: (state, action) => {
			state.friendRequestsArr = [...state.friendRequestsArr, ...action.payload];
		},
		setIsLoadingFriendRequests: (state, action) => {
			state.isLoadingFriendRequests = action.payload;
		},
		setHasFriendRequests: (state, action) => {
			state.hasFriendRequests = action.payload;
		},
		removeFriendRequest: (state, action) => {
			state.friendRequestsArr = state.friendRequestsArr.filter(
				(friendRequest) => friendRequest._id !== action.payload
			);
		},
		// PENDING
		setPendingsArr: (state, action) => {
			state.pendingsArr = action.payload;
		},
		addPendingsArr: (state, action) => {
			state.pendingsArr = [...state.pendingsArr, ...action.payload];
		},
		setIsLoadingPendings: (state, action) => {
			state.isLoadingPendings = action.payload;
		},
		setHasPendings: (state, action) => {
			state.hasPendings = action.payload;
		},
		// ALL
		resetState: (state) => {
			state.numberOfFriends = 0;
			state.friendsArr = [];
			state.isLoadingFriend = false;
			state.hasFriends = false;
			state.originalFriendsArr = [];
			state.randomFriendsArr = [];
			state.hasRandomFriends = false;
			state.originalRandomFriendsArr = [];
			state.friendRequestsArr = [];
			state.isLoadingFriendRequests = false;
			state.hasFriendRequests = false;
			state.pendingsArr = [];
			state.isLoadingPendings = false;
			state.hasPendings = false;
		},
	},
});

export const {
	// FRIEND
	setNumberOfFriends,
	setFriendsArr,
	addFriendsArr,
	setHasFriends,
	setOriginalFriendsArr,
	setIsLoadingFriend,
	removeFriend,
	removeRandomFriend,
	removeOriginalRandomFriend,
	setRandomFriendsArr,
	addRandomFriendsArr,
	setHasRandomFriends,
	setOriginalRandomFriendsArr,
	addOriginalRandomFriensArr,
	// FRIEND REQUESTS
	setFriendRequestsArr,
	addFriendRequestsArr,
	removeFriendRequest,
	setIsLoadingFriendRequests,
	setHasFriendRequests,
	// PENDING
	setPendingsArr,
	addPendingsArr,
	setIsLoadingPendings,
	setHasPendings,
	// ALL
	resetState,
} = friendSlice.actions;

export default friendSlice.reducer;
