export const INITIAL_STATE = {
	postDescription: "",
	postImagePath: "",
	isLiked: false,
	likesCount: 0,
	processing: false,
	showComment: false,
	commentsCount: 0,
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
			const { isLiked, postComments, postDescription, postLikes } =
				action.payload.post;
			return {
				...state,
				isLiked,
				likesCount: postLikes,
				commentsCount: postComments,
				postDescription,
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
		case "INCREASE_COMMENTS_COUNT": {
			return {
				...state,
				commentsCount: state.commentsCount + 1,
			};
		}
		case "DECREASE_COMMENTS_COUNT": {
			return {
				...state,
				commentsCount: state.commentsCount - 1,
			};
		}
		case "SET_POST_DESCRIPTION": {
			return {
				...state,
				postDescription: action.payload,
			};
		}
		case "SET_PROFILE_IMAGE_PATH": {
			return {
				...state,
				profileImagePath: action.payload,
			};
		}
		case "SET_COMMENTS_COUNT": {
			return {
				...state,
				commentsCount: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
