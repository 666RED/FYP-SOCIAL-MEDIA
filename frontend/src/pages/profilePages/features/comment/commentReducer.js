export const INITIAL_STATE = {
	commentDescription: "",
	showOptions: false,
};

export const commentReducer = (state, action) => {
	switch (action.type) {
		case "SET_COMMENT_DESCRIPTION": {
			return {
				...state,
				commentDescription: action.payload,
			};
		}
		case "TOGGLE_SHOW_OPTIONS": {
			return {
				...state,
				showOptions: !state.showOptions,
			};
		}
		default: {
			return state;
		}
	}
};
