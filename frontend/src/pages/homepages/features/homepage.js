import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	extendSideBar: false,
};

const homepageSlice = createSlice({
	name: "homepage",
	initialState,
	reducers: {
		setExtendSideBar: (state, action) => {
			state.extendSideBar = action.payload;
		},
	},
});

export const { setExtendSideBar } = homepageSlice.actions;

export default homepageSlice.reducer;
