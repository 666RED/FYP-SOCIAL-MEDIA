import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	name: "",
	profileImagePath: "",
	coverImagePath: "",
	bio: "",
	loading: false,
	showAddNewPostForm: false,
};

const userProfileSlice = createSlice({
	name: "userProfile",
	initialState,
	reducers: {
		setName: (state, action) => {
			state.name = action.payload;
		},
		setProfileImagePath: (state, action) => {
			state.profileImagePath = action.payload;
		},
		setCoverImagePath: (state, action) => {
			state.coverImagePath = action.payload;
		},
		setBio: (state, action) => {
			state.bio = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setShowAddNewPostForm: (state, action) => {
			state.showAddNewPostForm = action.payload;
		},
	},
});

export const {
	setName,
	setProfileImagePath,
	setCoverImagePath,
	setBio,
	setLoading,
	setShowAddNewPostForm,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
