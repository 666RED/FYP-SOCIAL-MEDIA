export const INITIAL_STATE = {
	profileImagePath: "",
	coverImagePath: "",
	name: "",
	bio: "",
	loading: false,
	isNameEdit: false,
	isBioEdit: false,
	makeChanges: false,
	frameColor: "",
};

export const editProfileReducer = (state, action) => {
	switch (action.type) {
		case "FIEST_RENDER": {
			const { profileImagePath, coverImagePath, name, bio, frameColor } =
				action.payload;
			return {
				...state,
				profileImagePath,
				coverImagePath,
				name,
				bio,
				frameColor,
			};
		}
		case "SET_PROFILE_IMAGE_PATH": {
			return {
				...state,
				profileImagePath: action.payload,
				makeChanges: true,
			};
		}
		case "SET_COVER_IMAGE_PATH": {
			return {
				...state,
				coverImagePath: action.payload,
				makeChanges: true,
			};
		}
		case "SET_NAME": {
			return {
				...state,
				name: action.payload,
				makeChanges: true,
			};
		}
		case "SET_BIO": {
			return {
				...state,
				bio: action.payload,
				makeChanges: true,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "TOGGLE_IS_NAME_EDIT": {
			return {
				...state,
				isNameEdit: !state.isNameEdit,
			};
		}
		case "TOGGLE_IS_BIO_EDIT": {
			return {
				...state,
				isBioEdit: !state.isBioEdit,
			};
		}
		case "MADE_CHANGES": {
			return {
				...state,
				makeChanges: true,
			};
		}
	}
};
