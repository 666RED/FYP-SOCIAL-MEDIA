import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	name: "",
	gender: "",
	email: "",
	phoneNumber: "",
	password: "",
	viewPassword: "password",
	validPhoneNumber: true,
	validEmail: true,
	loading: false,
};

const registerSlice = createSlice({
	name: "registerForm",
	initialState,
	reducers: {
		setName: (state, action) => {
			state.name = action.payload;
		},
		setGender: (state, action) => {
			state.gender = action.payload;
		},
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setPhoneNumber: (state, action) => {
			state.phoneNumber = action.payload;
		},
		setPassword: (state, action) => {
			state.password = action.payload;
		},
		togglePassword: (state) => {
			state.viewPassword =
				state.viewPassword === "password" ? "text" : "password";
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		invalidPhoneNumber: (state) => {
			state.validEmail = true;
			state.validPhoneNumber = false;
		},
		invalidEmail: (state) => {
			state.validEmail = false;
			state.validPhoneNumber = true;
		},
		emailExisted: (state) => {
			state.validEmail = false;
			state.validPhoneNumber = true;
		},
		phoneNumberExisted: (state) => {
			state.validEmail = true;
			state.validPhoneNumber = false;
		},
		successRegister: (state) => {
			state.displayRegForm = false;
		},
		clearRegisterState: (state) => {
			state.name = "";
			state.gender = "";
			state.email = "";
			state.phoneNumber = "";
			state.password = "";
			state.viewPassword = "password";
			state.validPhoneNumber = true;
			state.validEmail = true;
			state.loading = false;
		},
	},
});

export const {
	setName,
	setGender,
	setEmail,
	setPhoneNumber,
	setPassword,
	togglePassword,
	setLoading,
	invalidPhoneNumber,
	invalidEmail,
	emailExisted,
	phoneNumberExisted,
	successRegister,
	clearRegisterState,
} = registerSlice.actions;

export default registerSlice.reducer;
