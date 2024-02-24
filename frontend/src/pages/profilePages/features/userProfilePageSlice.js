import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loading: false,
	showAddNewPostForm: false,
	postAdded: false,
};

const userProfilePageSlice = createSlice({
	name: "userProfilePage",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setShowAddNewPostForm: (state, action) => {
			state.showAddNewPostForm = action.payload;
		},
		setPostAdded: (state, action) => {
			state.postAdded = action.payload;
		},
		clearState: (state) => {
			state.loading = false;
			state.showAddNewPostForm = false;
			state.postAdded = false;
		},
	},
});

export const { setLoading, setShowAddNewPostForm, setPostAdded, clearState } =
	userProfilePageSlice.actions;

export default userProfilePageSlice.reducer;
