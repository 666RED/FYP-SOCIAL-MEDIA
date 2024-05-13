export const INITIAL_STATE = {
	loading: true,
	serviceName: "",
	serviceDescription: "",
	serviceCategory: "",
	contactNumber: "",
	servicePosterImagePath: "",
	userName: "",
	userProfileImagePath: "",
	userId: "",
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
			};
		}
		default: {
			return state;
		}
	}
};
