import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	newPassword: "",
	validNewPassword: true,
	confirmPassword: "",
	validConfirmPassword: true,
	loading: false,
};

const resetPasswordSlice = createSlice({
	name: "resetPassword",
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setNewPassword: (state, action) => {
			state.newPassword = action.payload;
		},
		setConfirmPassword: (state, action) => {
			state.confirmPassword = action.payload;
		},
		setValidNewPassword: (state, action) => {
			state.validNewPassword = action.payload;
		},
		setValidConfirmPassword: (state, action) => {
			state.validConfirmPassword = action.payload;
		},
	},
});

export const {
	setLoading,
	setNewPassword,
	setConfirmPassword,
	setValidNewPassword,
	setValidConfirmPassword,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
