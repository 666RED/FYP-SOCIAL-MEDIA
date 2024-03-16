import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	commentsArray: [],
};

const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {
		updateComment: (state, action) => {
			const { postId, newCommentArray } = action.payload;

			const commentObjIndex = state.commentsArray.findIndex(
				(commentObj) => commentObj.postId === postId
			);

			state.commentsArray[commentObjIndex].comments = newCommentArray;
		},
		addComment: (state, action) => {
			const { postId, newComment } = action.payload;

			const commentObjIndex = state.commentsArray.findIndex(
				(commentObj) => commentObj.postId === postId
			);

			state.commentsArray[commentObjIndex].comments = [
				newComment,
				...state.commentsArray[commentObjIndex].comments,
			];
		},
		noComment: (state, action) => {
			state.commentsArray = [
				...state.commentsArray,
				{ postId: action.payload, comments: [] },
			];
		},
		pushComment: (state, action) => {
			if (
				!state.commentsArray.some(
					(comment) => comment.postId === action.payload.postId
				)
			) {
				state.commentsArray = [...state.commentsArray, action.payload];
			}
		},
		loadComments: (state, action) => {
			const postId = action.payload[0].postId;

			const commentObj = state.commentsArray.find(
				(comment) => comment.postId === action.payload[0].postId
			);

			if (commentObj) {
				const updatedCommentObj = {
					...commentObj,
					comments: [...commentObj.comments, ...action.payload],
				};

				state.commentsArray = state.commentsArray.map((comment) =>
					comment.postId === postId ? updatedCommentObj : comment
				);
			}
		},
		removeComment: (state, action) => {
			// remove comment based on post id
			state.commentsArray = state.commentsArray.filter(
				(comment) => comment._id !== action.payload
			);
		},
		resetCommentArray: (state) => {
			state.commentsArray = [];
		},
	},
});

export const {
	updateComment,
	addComment,
	noComment,
	pushComment,
	loadComments,
	removeComment,
	resetCommentArray,
} = commentSlice.actions;

export default commentSlice.reducer;
