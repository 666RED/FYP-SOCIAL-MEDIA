import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	posts: [],
	hasPost: false,
	isLoadingPost: false,
	showAddNewPostForm: false,
};

const userPostSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPost: (state, action) => {
			state.posts = action.payload;
		},
		loadPost: (state, action) => {
			state.posts = [...state.posts, ...action.payload];
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
		resetState: (state) => {
			state.posts = [];
			state.hasPost = false;
			state.isLoadingPost = false;
			state.showAddNewPostForm = false;
		},
		setIsLoadingPost: (state, action) => {
			state.isLoadingPost = action.payload;
		},
		setHasPost: (state, action) => {
			state.hasPost = action.payload;
		},
		setShowAddNewPostForm: (state, action) => {
			state.showAddNewPostForm = action.payload;
		},
	},
});

export const {
	setPost,
	loadPost,
	updatePost,
	removePost,
	addNewPost,
	resetState,
	setIsLoadingPost,
	setHasPost,
	setShowAddNewPostForm,
} = userPostSlice.actions;

export default userPostSlice.reducer;
