export const INITIAL_STATE = {
	isLiked: false,
	likesCount: 0,
	processing: false,
	showComment: false,
	showOptionDiv: false,
	showEditPostForm: false,
	loading: false,
};

export const groupPostReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_IS_LIKED": {
			return {
				...state,
				isLiked: action.payload,
			};
		}
		case "LIKE_POST": {
			return {
				...state,
				isLiked: true,
				likesCount: state.likesCount + 1,
			};
		}
		case "DISLIKE_POST": {
			return {
				...state,
				isLiked: false,
				likesCount: state.likesCount - 1,
			};
		}
		case "FIRST_RENDER": {
			const { likesMap, postLikes, postFilePath, postImagePath } =
				action.payload.post;

			return {
				...state,
				isLiked: likesMap.hasOwnProperty(action.payload.userId),
				likesCount: postLikes,
			};
		}
		case "SET_PROCESSING": {
			return {
				...state,
				processing: action.payload,
			};
		}
		case "TOGGLE_COMMENT": {
			return {
				...state,
				showComment: !state.showComment,
			};
		}
		case "TOGGLE_SHOW_OPTION_DIV": {
			return {
				...state,
				showOptionDiv: !state.showOptionDiv,
			};
		}
		case "TOGGLE_SHOW_EDIT_POST_FORM": {
			return {
				...state,
				showEditPostForm: !state.showEditPostForm,
			};
		}
		default: {
			return state;
		}
	}
};
