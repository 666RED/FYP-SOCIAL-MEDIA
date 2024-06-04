export const INITIAL_STATE = {
	loading: false,
	name: "",
	gender: "",
	email: "",
	phoneNumber: "",
};

export const updatePersonalInfoReducer = (state, action) => {
	switch (action.type) {
		case "FIRST_RENDER": {
			const { userName, userGender, userEmailAddress, userPhoneNumber } =
				action.payload;
			return {
				...state,
				name: userName,
				gender: userGender,
				email: userEmailAddress,
				phoneNumber: userPhoneNumber,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_NAME": {
			return {
				...state,
				name: action.payload,
			};
		}
		case "SET_GENDER": {
			return {
				...state,
				gender: action.payload,
			};
		}
		case "SET_PHONE_NUMBER": {
			return {
				...state,
				phoneNumber: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
