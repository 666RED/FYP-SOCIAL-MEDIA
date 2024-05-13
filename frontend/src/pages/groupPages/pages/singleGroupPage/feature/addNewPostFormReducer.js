export const INITIAL_STATE = {
	loading: false,
	text: "",
	imagePath: "",
	image: {},
	filePath: "",
	file: {},
	makeChanges: false,
	inputType: "image",
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
				makeChanges: true,
			};
		}
		case "UPLOAD_IMAGE": {
			const { imagePath, image } = action.payload;
			return {
				...state,
				imagePath,
				image,
				makeChanges: true,
			};
		}
		case "UPLOAD_FILE": {
			const { filePath, file } = action.payload;
			return {
				...state,
				filePath,
				file,
				makeChanges: true,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				imagePath: "",
				image: {},
				madeChanges: true,
			};
		}
		case "REMOVE_FILE": {
			return {
				...state,
				filePath: "",
				file: {},
				madeChanges: true,
			};
		}
		case "SET_INPUT_TYPE": {
			return {
				...state,
				inputType: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
