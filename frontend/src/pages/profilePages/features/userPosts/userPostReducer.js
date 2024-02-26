export const INITIAL_STATE = {
	postImagePath: "",
	isLiked: false,
	likesCount: 0,
	processing: false,
	showComment: false,
	showOptionDiv: false,
	showEditPostForm: false,
	loading: false,
};

export const userPostReducer = (state, action) => {
	switch (action.type) {
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
			const { likesMap, postLikes, userId } = action.payload.post;

			return {
				...state,
				isLiked: likesMap.hasOwnProperty(userId._id),
				likesCount: postLikes,
				postImagePath: action.payload.postImagePath,
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
		case "SET_PROFILE_IMAGE_PATH": {
			return {
				...state,
				profileImagePath: action.payload,
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
