import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	posts: [],
};

const userPostSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPost: (state, action) => {
			state.posts = action.payload;
		},
		// edit post
		updatePost: (state, action) => {
			state.posts = state.posts.map((post) =>
				post._id === action.payload._id ? action.payload : post
			);
		},
		removePost: (state, action) => {
			state.posts = state.posts.filter((post) => post._id !== action.payload);
		},
		addNewPost: (state, action) => {
			state.posts = [action.payload, ...state.posts];
		},
	},
});

export const { setPost, updatePost, removePost, addNewPost } =
	userPostSlice.actions;

export default userPostSlice.reducer;
