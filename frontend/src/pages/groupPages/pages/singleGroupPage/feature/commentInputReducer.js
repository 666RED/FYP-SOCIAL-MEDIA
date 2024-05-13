export const INITIAL_STATE = {
	comment: "",
	loading: false,
};

export const commentInputReducer = (state, action) => {
	switch (action.type) {
		case "SET_COMMENT": {
			return {
				...state,
				comment: action.payload,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SENT_COMMENT": {
			return {
				...state,
				comment: "",
				loading: false,
			};
		}
		default: {
			return state;
		}
	}
};
