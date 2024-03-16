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
		case "UPLOAD_IMAGE": {
			const { imagePath, image, hasChanged } = action.payload;
			return {
				...state,
				imagePath: imagePath,
				image: image,
				madeChange: hasChanged,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				imagePath: "",
				image: {},
				madeChange: true,
			};
		}
		default: {
			return state;
		}
	}
};
