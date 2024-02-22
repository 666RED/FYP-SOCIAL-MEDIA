export const INITIAL_STATE = {
	email: "",
	loading: false,
	validEmail: true,
};

export const recoverPasswordReducer = (state, action) => {
	switch (action.type) {
		case "SET_EMAIL": {
			return {
				...state,
				email: action.payload,
			};
		}
		case "INVALID_EMAIL": {
			return {
				...state,
				validEmail: false,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
