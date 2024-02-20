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
	},
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
