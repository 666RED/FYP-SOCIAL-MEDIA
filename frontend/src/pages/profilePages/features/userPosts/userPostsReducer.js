export const INITIAL_STATE = {
	posts: [],
	hasPost: false,
	loading: false,
};

export const userPostsReducer = (state, action) => {
	switch (action.type) {
		case "SET_POSTS": {
			return {
				...state,
				posts: action.payload,
			};
		}
		case "SET_HAS_POST": {
			return {
				...state,
				hasPost: action.payload,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
	}
};
