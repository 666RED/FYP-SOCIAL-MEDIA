export const INITIAL_STATE = {
	newPassword: "",
	validNewPassword: true,
	confirmPassword: "",
	validConfirmPassword: true,
	loading: false,
};

export const resetPasswordReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_NEW_PASSWORD": {
			return {
				...state,
				newPassword: action.payload,
			};
		}
		case "SET_CONFIRM_PASSWORD": {
			return {
				...state,
				confirmPassword: action.payload,
			};
		}
		case "SET_VALID_PASSWORDS": {
			return {
				...state,
				validNewPassword: action.payload,
				validConfirmPassword: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
