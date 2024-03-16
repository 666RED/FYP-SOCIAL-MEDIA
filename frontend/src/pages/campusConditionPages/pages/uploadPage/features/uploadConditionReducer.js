export const INITIAL_STATE = {
	title: "",
	description: "",
	loading: false,
	madeChanges: false,
	postImagePath: "",
	postImage: {},
};

export const uploadConditionReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "UPLOAD_IMAGE": {
			const { imagePath, image, hasChanged } = action.payload;
			return {
				...state,
				postImagePath: imagePath,
				postImage: image,
				madeChanges: hasChanged,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				postImagePath: "",
				image: {},
				madeChanges: true,
			};
		}
		case "SET_TITLE": {
			return {
				...state,
				title: action.payload,
				madeChanges: true,
			};
		}
		case "SET_DESCRIPTION": {
			return {
				...state,
				description: action.payload,
				madeChanges: true,
			};
		}
		default: {
			return state;
		}
	}
};
