import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	email: "",
	loading: false,
	validEmail: true,
};

const recoverPasswordSlice = createSlice({
	name: "recoverPassword",
	initialState,
	reducers: {
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setValidEmail: (state, action) => {
			state.validEmail = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const { setEmail, setValidEmail, setLoading } =
	recoverPasswordSlice.actions;

export default recoverPasswordSlice.reducer;
