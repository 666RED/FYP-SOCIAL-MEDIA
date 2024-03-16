export const INITIAL_STATE = {
	hasPostDescriptionChanged: false,
	hasImagePathChanged: false,
	loading: false,
	postDescription: "",
	postImagePath: "",
	image: {},
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
		case "FIRST_RENDER": {
			return {
				...state,
				postDescription: action.payload.postDescription,
				postImagePath: action.payload.postImagePath,
			};
		}
		case "UPLOAD_IMAGE": {
			const { imagePath, image, hasChanged } = action.payload;
			return {
				...state,
				postImagePath: imagePath,
				image: image,
				hasImagePathChanged: hasChanged,
			};
		}
		default: {
			return state;
		}
	}
};
