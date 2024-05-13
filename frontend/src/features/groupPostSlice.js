import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	groupPosts: [],
	hasPost: false,
	isLoadingPost: false,
	commentsArray: [],
};

const groupPostSlice = createSlice({
	name: "groupPost",
	initialState,
	reducers: {
		addNewPost: (state, action) => {
			state.groupPosts = [action.payload, ...state.groupPosts];
			state.hasPost = true;
		},
		setHasPost: (state, action) => {
			state.hasPost = action.payload;
		},
		resetGroupPostState: (state) => {
			state.groupPosts = [];
			state.hasPost = false;
			state.isLoadingPost = false;
		},
		setGroupPosts: (state, action) => {
			state.groupPosts = action.payload;
		},
		loadPost: (state, action) => {
			state.groupPosts = [...state.groupPosts, ...action.payload];
		},
		updatePost: (state, action) => {
			state.groupPosts = state.groupPosts.map((post) =>
				post._id === action.payload._id ? action.payload : post
			);
		},
		removePost: (state, action) => {
			state.groupPosts = state.groupPosts.filter(
				(post) => post._id !== action.payload
			);
		},
		setIsLoadingPost: (state, action) => {
			state.isLoadingPost = action.payload;
		},
		updateComment: (state, action) => {
			state.commentsArray = state.commentsArray.map((comment) =>
				comment._id === action.payload._id ? action.payload : comment
			);
		},
		addComment: (state, action) => {
			state.commentsArray = [action.payload, ...state.commentsArray];
		},
		pushComments: (state, action) => {
			state.commentsArray = [...state.commentsArray, ...action.payload];
		},
		loadComments: (state, action) => {
			state.commentsArray = [...state.commentsArray, ...action.payload];
		},
		removeComment: (state, action) => {
			state.commentsArray = state.commentsArray.filter(
				(comment) => comment.groupPostId !== action.payload
			);
		},
		resetCommentArray: (state) => {
			state.commentsArray = [];
		},
		deleteComment: (state, action) => {
			state.commentsArray = state.commentsArray.filter(
				(comment) => comment._id !== action.payload
			);
		},
	},
});

export const {
	addNewPost,
	setHasPost,
	resetGroupPostState,
	setGroupPosts,
	loadPost,
	updatePost,
	removePost,
	setIsLoadingPost,
	updateComment,
	addComment,
	pushComments,
	loadComments,
	removeComment,
	deleteComment,
} = groupPostSlice.actions;

export default groupPostSlice.reducer;
