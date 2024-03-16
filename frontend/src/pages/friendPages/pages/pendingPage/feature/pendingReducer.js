export const INITIAL_STATE = {
	loading: false,
	isPending: true,
	friendStatus: "",
	friendRequest: {},
};

export const pendingReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_IS_PENDING": {
			return {
				...state,
				isPending: action.payload,
			};
		}
		case "SET_FRIEND_STATUS": {
			return {
				...state,
				friendStatus: action.payload,
			};
		}
		case "SET_FRIEND_REQUEST": {
			return {
				...state,
				friendRequest: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
