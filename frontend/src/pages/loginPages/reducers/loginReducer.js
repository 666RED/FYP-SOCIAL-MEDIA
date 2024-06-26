export const INITIAL_STATE = {
	email: "",
	password: "",
	isUserExist: true,
	isPasswordCorrect: true,
	viewPassword: false,
};

export const loginReducer = (state, action) => {
	switch (action.type) {
		case "SET_EMAIL":
			return {
				...state,
				email: action.payload,
			};
		case "SET_PASSWORD":
			return {
				...state,
				password: action.payload,
			};
		case "USER_NOT_EXIST":
			return {
				...state,
				isUserExist: false,
				isPasswordCorrect: true,
			};
		case "INVALID_CREDENTIALS":
			return {
				...state,
				isUserExist: true,
				isPasswordCorrect: false,
			};
		case "TOGGLE_VIEW_PASSWORD":
			return {
				...state,
				viewPassword: !state.viewPassword,
			};
		default:
			return state;
	}
};

export default loginReducer;
