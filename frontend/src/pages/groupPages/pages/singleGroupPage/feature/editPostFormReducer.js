export const INITIAL_STATE = {
	hasPostDescriptionChanged: false,
	hasImagePathChanged: false,
	hasFilePathChanged: false,
	loading: false,
	postDescription: "",
	postImagePath: "",
	postFilePath: "",
	image: {},
	file: {},
	inputType: "",
};

export const editPostFormReducer = (state, action) => {
	switch (action.type) {
		case "SET_POST_DESCRIPTION": {
			return {
				...state,
				postDescription: action.payload,
			};
		}
		case "SET_HAS_POST_DESCRIPTION_CHANGED": {
			return {
				...state,
				hasPostDescriptionChanged: action.payload,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				postImagePath: "",
				image: {},
				hasImagePathChanged: true,
			};
		}
		case "REMOVE_FILE": {
			return {
				...state,
				postFilePath: "",
				file: {},
				hasFilePathChanged: true,
			};
		}
		case "FIRST_RENDER": {
			const { postDescription, postImagePath, postFilePath } = action.payload;
			const inputType =
				postImagePath === ""
					? postFilePath === ""
						? "image"
						: "file"
					: "image";

			return {
				...state,
				postDescription,
				postImagePath,
				postFilePath,
				inputType,
			};
		}
		case "UPLOAD_IMAGE": {
			const { imagePath, image } = action.payload;
			return {
				...state,
				postImagePath: imagePath,
				image: image,
				hasImagePathChanged: true,
			};
		}
		case "UPLOAD_FILE": {
			const { filePath, file } = action.payload;
			return {
				...state,
				postFilePath: filePath,
				file,
				hasFilePathChanged: true,
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
