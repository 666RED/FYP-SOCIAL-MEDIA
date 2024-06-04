import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	commentsArray: [],
};

const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {
		updateComment: (state, action) => {
			state.commentsArray = state.commentsArray.map((comment) =>
				comment._id === action.payload._id ? action.payload : comment
			);
		},
		addComment: (state, action) => {
			state.commentsArray = [action.payload, ...state.commentsArray];
		},
		pushComment: (state, action) => {
			state.commentsArray = [...state.commentsArray, ...action.payload];
		},
		loadComments: (state, action) => {
			state.commentsArray = [...state.commentsArray, ...action.payload];
		},
		removeComment: (state, action) => {
			// remove comment based on post id
			state.commentsArray = state.commentsArray.filter(
				(comment) => comment.postId !== action.payload
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
	updateComment,
	addComment,
	pushComment,
	loadComments,
	removeComment,
	resetCommentArray,
	deleteComment,
} = commentSlice.actions;

export default commentSlice.reducer;
