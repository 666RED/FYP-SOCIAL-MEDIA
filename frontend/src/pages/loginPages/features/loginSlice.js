import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	email: "",
	password: "",
	isUserExist: true,
	isPasswordCorrect: true,
	displayRegForm: false,
	viewPassword: false,
	loading: false,
};

const loginSlice = createSlice({
	name: "loginForm",
	initialState,
	reducers: {
		setDisplayRegForm: (state) => {
			state.displayRegForm = !state.displayRegForm;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		userNotExist: (state) => {
			state.isUserExist = false;
			state.isPasswordCorrect = true;
		},
		invalidCredentials: (state) => {
			state.isUserExist = true;
			state.isPasswordCorrect = false;
		},
		successLogin: (state) => {
			state.isUserExist = true;
			state.isPasswordCorrect = true;
			state.email = "";
			state.password = "";
		},
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setPassword: (state, action) => {
			state.password = action.payload;
		},
		setViewPassword: (state) => {
			state.viewPassword = !state.viewPassword;
		},
		clearState: (state) => {
			state.email = "";
			state.password = "";
			state.displayRegForm = false;
			state.isUserExist = true;
			state.isPasswordCorrect = true;
		},
	},
});

export const {
	setDisplayRegForm,
	setLoading,
	userNotExist,
	invalidCredentials,
	successLogin,
	setEmail,
	setPassword,
	setViewPassword,
	clearState,
} = loginSlice.actions;

export default loginSlice.reducer;
