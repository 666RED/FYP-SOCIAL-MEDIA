import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	email: "",
	password: "",
	isUserExist: true,
	isPasswordCorrect: true,
	viewPassword: false,
};

const loginSlice = createSlice({
	name: "login",
	initialState,
	reducers: {
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setPassword: (state, action) => {
			state.password = action.payload;
		},
		userNotExist: (state, action) => {
			state.isUserExist = false;
			state.isPasswordCorrect = true;
		},
		invalidCredentials: (state) => {
			state.isUserExist = true;
			state.isPasswordCorrect = false;
		},
		successLogin: (state) => {
			state.email = "";
			state.password = "";
			state.isUserExist = true;
			state.isPasswordCorrect = true;
			state.viewPassword = false;
		},
		toggleViewPassword: (state) => {
			state.viewPassword = !state.viewPassword;
		},
		clearState: (state) => {
			state.email = "";
			state.password = "";
			state.isUserExist = true;
			state.isPasswordCorrect = true;
			state.viewPassword = false;
		},
	},
});

export const {
	setEmail,
	setPassword,
	userNotExist,
	invalidCredentials,
	successLogin,
	toggleViewPassword,
	clearState,
} = loginSlice.actions;

export default loginSlice.reducer;
