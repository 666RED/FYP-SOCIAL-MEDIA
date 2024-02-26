import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	commentsObj: {},
	commentsArray: [],
};

const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {
		setCommentsObj: (state, action) => {
			const { commentsCount, postId } = action.payload;
			state.commentsObj[postId] = commentsCount;
		},
		increaseCommentCount: (state, action) => {
			const { postId } = action.payload;

			state.commentsObj[postId] += 1;
		},
		decreaseCommentCount: (state, action) => {
			const { postId } = action.payload;

			state.commentsObj[postId] -= 1;
		},
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
		gotComment: (state, action) => {
			// if the commentsObj is not in the array yet
			if (
				state.commentsArray.filter(
					(commentObj) => commentObj.postId === action.payload.postId
				).length < 1
			) {
				// pushing newCommentsArray into the array
				state.commentsArray.push(action.payload);
			}
		},
	},
});

export const {
	setCommentsObj,
	increaseCommentCount,
	decreaseCommentCount,
	updateComment,
	addComment,
	noComment,
	gotComment,
} = commentSlice.actions;

export default commentSlice.reducer;
