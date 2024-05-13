export const INITIAL_STATE = {
	loading: false,
	commentDescription: "",
	showOptions: false,
	showEditCommentForm: false,
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
		case "TOGGLE_EDIT_COMMENT_FORM": {
			return {
				...state,
				showEditCommentForm: !state.showEditCommentForm,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
