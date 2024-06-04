export const INITIAL_STATE = {
	loadMore: false,
	count: 10,
	showAddNewPostForm: false,
	loading: false,
};

export const singleGroupPageReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_LOAD_MORE": {
			return {
				...state,
				loadMore: action.payload,
			};
		}
		case "TOGGLE_SHOW_ADD_NEW_POST_FORM": {
			return {
				...state,
				showAddNewPostForm: !state.showAddNewPostForm,
			};
		}
		case "INCREASE_COUNT": {
			return {
				...state,
				count: state.count + 10,
			};
		}
		default: {
			return state;
		}
	}
};
