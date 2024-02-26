import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loading: false,
	showAddNewPostForm: false,
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
		clearState: (state) => {
			state.loading = false;
			state.showAddNewPostForm = false;
		},
	},
});

export const { setLoading, setShowAddNewPostForm, clearState } =
	userProfilePageSlice.actions;

export default userProfilePageSlice.reducer;
