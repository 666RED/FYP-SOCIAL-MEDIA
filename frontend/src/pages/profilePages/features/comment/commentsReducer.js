export const INITIAL_STATE = {
	loading: false,
	commentsArray: [],
	hasComment: false,
};

export const commentsReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_COMMENTS_ARRAY": {
			return {
				...state,
				commentsArray: action.payload,
			};
		}
		case "SET_HAS_COMMENT": {
			return {
				...state,
				hasComment: action.payload,
			};
		}
		case "NO_COMMENT": {
			return {
				...state,
				hasComment: false,
				commentsArray: [],
			};
		}
		case "HAS_COMMENT": {
			return {
				...state,
				hasComment: true,
				commentsArray: action.payload,
			};
		}
		case "ADD_NEW_COMMENT": {
			return {
				...state,
				commentsArray: [action.payload, ...state.commentsArray],
			};
		}
		default: {
			return state;
		}
	}
};
