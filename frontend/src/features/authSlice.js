import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: null,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
		},
		updateUserInfo: (state, action) => {
			console.log(action.payload);
			const { name, bio, profileImagePath, coverImagePath } = action.payload;

			state.user.userName = name;
			state.user.userProfile.bio = bio;
			state.user.userProfile.profileImagePath = profileImagePath;
			state.user.userProfile.coverImagePath = coverImagePath;
		},
	},
});

export const { setUser, logout, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;
