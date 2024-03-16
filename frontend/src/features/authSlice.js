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
		setUserFriendsMap: (state, action) => {
			state.user.userFriendsMap = action.payload;
		},
	},
});

export const { setUser, logout, setUserFriendsMap } = authSlice.actions;

export default authSlice.reducer;
