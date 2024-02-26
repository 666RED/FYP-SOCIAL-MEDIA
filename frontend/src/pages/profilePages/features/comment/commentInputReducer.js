export const INITIAL_STATE = {
	comment: "",
	isProcessing: false,
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
		case "SET_IS_PROCESSING": {
			return {
				...state,
				isProcessing: action.payload,
			};
		}
		case "SENT_COMMENT": {
			return {
				...state,
				comment: "",
				isProcessing: false,
				loading: false,
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
