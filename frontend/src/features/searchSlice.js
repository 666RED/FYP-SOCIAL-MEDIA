import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	searchText: "",
};

const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		setSearchText: (state, action) => {
			state.searchText = action.payload;
		},
		resetSearchText: (state) => {
			state.searchText = "";
		},
	},
});

export const { setSearchText, resetSearchText } = searchSlice.actions;

export default searchSlice.reducer;
