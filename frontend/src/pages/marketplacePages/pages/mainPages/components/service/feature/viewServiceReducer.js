export const INITIAL_STATE = {
	loading: true,
	serviceName: "",
	serviceDescription: "",
	serviceCategory: "",
	contactNumber: "",
	servicePosterImagePath: "",
	userName: "",
	userProfileImagePath: "",
	frameColor: "",
	userId: "",
	showReportForm: false,
};

export const viewServiceReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}

		case "FIRST_RENDER": {
			const {
				serviceName,
				serviceDescription,
				serviceCategory,
				contactNumber,
				servicePosterImagePath,
				userName,
				userProfileImagePath,
				userId,
				frameColor,
			} = action.payload;

			return {
				...state,
				serviceName,
				serviceDescription,
				serviceCategory,
				contactNumber,
				servicePosterImagePath,
				userName,
				userProfileImagePath,
				userId,
				frameColor,
			};
		}
		case "TOGGLE_SHOW_REPORT_FORM": {
			return {
				...state,
				showReportForm: !state.showReportForm,
			};
		}
		default: {
			return state;
		}
	}
};
