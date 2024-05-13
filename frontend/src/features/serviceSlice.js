import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	servicesArr: [],
	originalServicesArr: [],
	isLoadingServices: false,
	hasServices: true,
	serviceCategory: "all",
};

const serviceSlice = createSlice({
	name: "service",
	initialState,
	reducers: {
		setServicesArr: (state, action) => {
			state.servicesArr = action.payload;
		},
		addServicesArr: (state, action) => {
			state.servicesArr = [...state.servicesArr, ...action.payload];
		},
		setOriginalServicesArr: (state, action) => {
			state.originalServicesArr = action.payload;
		},
		setHasServices: (state, action) => {
			state.hasServices = action.payload;
		},
		setIsLoadingServices: (state, action) => {
			state.isLoadingServices = action.payload;
		},
		setServiceCategory: (state, action) => {
			state.serviceCategory = action.payload;
		},
		resetState: (state) => {
			state.servicesArr = [];
			state.originalServicesArr = [];
			state.isLoadingServices = false;
			state.hasServices = true;
			state.serviceCategory = "all";
		},
	},
});

export const {
	setServicesArr,
	addServicesArr,
	setOriginalServicesArr,
	setHasServices,
	setIsLoadingServices,
	setServiceCategory,
	resetState,
} = serviceSlice.actions;

export default serviceSlice.reducer;
