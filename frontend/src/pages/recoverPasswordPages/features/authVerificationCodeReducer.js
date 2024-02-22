export const INITIAL_STATE = {
	code: "",
	validCode: true,
	loading: false,
	resend: false,
	remainingTime: 60,
};

export const authVerificationCodeReducer = (state, action) => {
	switch (action.type) {
		case "SET_CODE": {
			return {
				...state,
				code: action.payload,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "INVALID_CODE": {
			return {
				...state,
				validCode: false,
			};
		}
		case "SET_RESEND": {
			return {
				...state,
				resend: action.payload,
			};
		}
		case "SET_REMAINING_TIME": {
			return {
				...state,
				remainingTime: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
