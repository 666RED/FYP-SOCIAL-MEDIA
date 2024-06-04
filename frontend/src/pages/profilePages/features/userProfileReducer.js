export const INITIAL_STATE = {
	name: "",
	profileImagePath: "",
	frameColor: "",
	coverImagePath: "",
	bio: "",
	loading: false,
	isUser: false,
	loadFriendStatus: true,
	friendStatus: "",
	showRespondForm: false,
	friendRequest: {},
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
		case "SET_FRAME_COLOR": {
			return {
				...state,
				frameColor: action.payload,
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
				frameColor: action.payload.frameColor,
			};
		}
		case "SET_IS_USER": {
			return {
				...state,
				isUser: action.payload,
			};
		}
		case "SET_LOAD_FRIEND_STATUS": {
			return {
				...state,
				loadFriendStatus: action.payload,
			};
		}
		case "SET_FRIEND_STATUS": {
			return {
				...state,
				friendStatus: action.payload,
			};
		}
		case "SET_FRIEND_STATUS_AND_REQUEST": {
			return {
				...state,
				friendStatus: action.payload.friendStatus,
				friendRequest: action.payload.friendRequest,
			};
		}
		case "TOGGLE_SHOW_RESPOND_FORM": {
			return {
				...state,
				showRespondForm: !state.showRespondForm,
			};
		}
		default: {
			return state;
		}
	}
};
