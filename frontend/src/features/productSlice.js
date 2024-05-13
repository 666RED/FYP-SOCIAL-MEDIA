import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	productsArr: [],
	originalProductsArr: [],
	isLoadingProducts: false,
	hasProducts: true,
};

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		setProductsArr: (state, action) => {
			state.productsArr = action.payload;
		},
		addProductsArr: (state, action) => {
			state.productsArr = [...state.productsArr, ...action.payload];
		},
		setOriginalProductsArr: (state, action) => {
			state.originalProductsArr = action.payload;
		},
		setHasProducts: (state, action) => {
			state.hasProducts = action.payload;
		},
		setIsLoadingProducts: (state, action) => {
			state.isLoadingProducts = action.payload;
		},
		resetState: (state) => {
			state.productsArr = [];
			state.originalProductsArr = [];
			state.isLoadingProducts = false;
			state.hasProducts = true;
		},
	},
});

export const {
	setProductsArr,
	addProductsArr,
	setOriginalProductsArr,
	setHasProducts,
	setIsLoadingProducts,
	resetState,
} = productSlice.actions;

export default productSlice.reducer;
