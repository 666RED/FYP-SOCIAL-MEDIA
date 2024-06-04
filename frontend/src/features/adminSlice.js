import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: null,
	user: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		setAdmin: (state, action) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
		},
	},
});

export const { setAdmin, logout } = adminSlice.actions;

export default adminSlice.reducer;
