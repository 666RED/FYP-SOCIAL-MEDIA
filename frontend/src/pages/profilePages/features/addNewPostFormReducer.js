export const INITIAL_STATE = {
	loading: false,
	text: "",
	imagePath: "",
	image: {},
	madeChange: false,
};

export const addNewPostFormReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_TEXT": {
			return {
				...state,
				text: action.payload,
			};
		}
		case "SET_IMAGE_PATH": {
			return {
				...state,
				imagePath: action.payload,
			};
		}
		case "SET_IMAGE": {
			return {
				...state,
				image: action.payload,
			};
		}
		case "MADE_CHANGE": {
			return {
				...state,
				madeChange: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
