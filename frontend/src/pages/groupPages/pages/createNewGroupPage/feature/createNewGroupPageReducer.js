export const INITIAL_STATE = {
	name: "",
	bio: "",
	groupImage: {},
	groupImagePath: "",
	groupCoverImage: {},
	groupCoverImagePath: "",
	loading: false,
	hasGroupImageChanged: false,
	hasGroupCoverImageChanged: false,
	madeChanges: false,
};

export const createNewGroupPageReducer = (state, action) => {
	switch (action.type) {
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
				madeChanges: true,
			};
		}
		case "SET_BIO": {
			return {
				...state,
				bio: action.payload,
				madeChanges: true,
			};
		}
		case "UPLOAD_IMAGE": {
			const { image, imagePath, hasChanged } = action.payload;
			return {
				...state,
				groupImage: image,
				groupImagePath: imagePath,
				madeChanges: hasChanged,
				hasGroupImageChanged: hasChanged,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				groupImage: {},
				groupImagePath: "",
				madeChanges: true,
			};
		}
		case "UPLOAD_COVER_IMAGE": {
			const { image, imagePath, hasChanged } = action.payload;
			return {
				...state,
				groupCoverImage: image,
				groupCoverImagePath: imagePath,
				madeChanges: hasChanged,
				hasGroupCoverImageChanged: hasChanged,
			};
		}
		case "REMOVE_COVER_IMAGE": {
			return {
				...state,
				groupCoverImage: {},
				groupCoverImagePath: "",
				madeChanges: true,
			};
		}
		default: {
			return state;
		}
	}
};
