export const INITIAL_STATE = {
	name: "",
	gender: "",
	email: "",
	phoneNumber: "",
	password: "",
	viewPassword: "password",
	validPhoneNumber: true,
	validEmail: true,
	loading: false,
	discardChanges: false,
};

export const registerReducer = (state, action) => {
	switch (action.type) {
		case "SET_NAME": {
			return {
				...state,
				name: action.payload,
				discardChanges: true,
			};
		}
		case "SET_GENDER": {
			return {
				...state,
				gender: action.payload,
				discardChanges: true,
			};
		}
		case "SET_EMAIL": {
			return {
				...state,
				email: action.payload,
				discardChanges: true,
			};
		}
		case "SET_PHONE_NUMBER": {
			return {
				...state,
				phoneNumber: action.payload,
				discardChanges: true,
			};
		}
		case "SET_PASSWORD": {
			return {
				...state,
				password: action.payload,
				discardChanges: true,
			};
		}
		case "TOGGLE_PASSWORD": {
			const newViewPassword =
				state.viewPassword === "password" ? "text" : "password";
			return {
				...state,
				viewPassword: newViewPassword,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "INVALID_PHONE_NUMBER": {
			return {
				...state,
				validEmail: true,
				validPhoneNumber: false,
			};
		}
		case "INVALID_EMAIL": {
			return {
				...state,
				validEmail: false,
				validPhoneNumber: true,
			};
		}
		case "EMAIL_EXISTED": {
			return {
				...state,
				validEmail: false,
				validPhoneNumber: true,
			};
		}
		case "PHONE_NUMBER_EXISTED": {
			return {
				...state,
				validEmail: true,
				validPhoneNumber: false,
			};
		}
		case "SUCCESS_REGISTER": {
			return {
				name: "",
				gender: "",
				email: "",
				phoneNumber: "",
				password: "",
				viewPassword: "password",
				validPhoneNumber: true,
				validEmail: true,
				loading: false,
				displayRegForm: false,
			};
		}
		default: {
			return state;
		}
	}
};
