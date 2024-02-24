export const INITIAL_STATE = {
	name: "",
	profileImagePath: "",
	coverImagePath: "",
	bio: "",
	loading: false,
};

export const userProfileReducer = (state, action) => {
	switch (action.type) {
		case "SET_NAME": {
			return {
				...state,
				name: action.payload,
			};
		}
		case "SET_PROFILE_IMAGE_PATH": {
			return {
				...state,
				profileImagePath: action.payload,
			};
		}
		case "SET_COVER_IMAGE_PATH": {
			return {
				...state,
				coverImagePath: action.payload,
			};
		}
		case "SET_BIO": {
			return {
				...state,
				bio: action.payload,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "FETCH_DATA": {
			return {
				...state,
				name: action.payload.name,
				profileImagePath: action.payload.profileImagePath,
				coverImagePath: action.payload.coverImagePath,
				bio: action.payload.bio,
			};
		}
		default: {
			return state;
		}
	}
};
