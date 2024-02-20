import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	code: "",
	validCode: true,
	loading: false,
	resend: false,
	remainingTime: 60,
};

const authVerificationCodeSlice = createSlice({
	name: "authVerificationCodeSlice",
	initialState,
	reducers: {
		setCode: (state, action) => {
			state.code = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setValidCode: (state, action) => {
			state.validCode = action.payload;
		},
		setResend: (state, action) => {
			state.resend = action.payload;
		},
		setRemainingTime: (state, action) => {
			state.remainingTime = action.payload;
		},
	},
});

export const {
	setCode,
	setLoading,
	setValidCode,
	setResend,
	setRemainingTime,
} = authVerificationCodeSlice.actions;

export default authVerificationCodeSlice.reducer;
