import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	posts: [],
	hasPosts: false,
	isLoadingPosts: false,
	showAddNewPostForm: false,
};

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
		},
		loadPosts: (state, action) => {
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
			state.hasPosts = false;
			state.isLoadingPosts = false;
			state.showAddNewPostForm = false;
		},
		setIsLoadingPosts: (state, action) => {
			state.isLoadingPosts = action.payload;
		},
		setHasPosts: (state, action) => {
			state.hasPosts = action.payload;
		},
		setShowAddNewPostForm: (state, action) => {
			state.showAddNewPostForm = action.payload;
		},
	},
});

export const {
	setPosts,
	loadPosts,
	updatePost,
	removePost,
	addNewPost,
	resetState,
	setIsLoadingPosts,
	setHasPosts,
	setShowAddNewPostForm,
} = postSlice.actions;

export default postSlice.reducer;
