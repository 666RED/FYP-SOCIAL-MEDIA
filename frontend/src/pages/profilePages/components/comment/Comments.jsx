import { React, useEffect, useContext, useReducer, createContext } from "react";
import { useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import CommentInput from "./CommentInput.jsx";
import Loader from "../../../../components/Loader.jsx";
import Error from "../../../../components/Error.jsx";
import {
	commentsReducer,
	INITIAL_STATE,
} from "../../features/comment/commentsReducer.js";
import ACTION_TYPES from "../../actionTypes/comment/commentsActionTypes.js";
import { ServerContext } from "../../../../App.js";
import { useSnackbar } from "notistack";
export const CommentsContext = createContext(null);

const Comments = ({ post }) => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(commentsReducer, INITIAL_STATE);

	useEffect(() => {
		const fetchComments = async () => {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			try {
				const res = await fetch(`${serverURL}/comment/get-comments`, {
					method: "POST",
					body: JSON.stringify({ postId: post._id }),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) {
					if (res.status === 403) {
						enqueueSnackbar("Access Denied", { variant: "error" });
					} else {
						enqueueSnackbar("Server Error", { variant: "error" });
					}
					return;
				}

				const { msg, comments } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.HAS_COMMENT,
						payload: comments,
					});
				} else if (msg === "No Comment") {
					dispatch({ type: ACTION_TYPES.NO_COMMENT });
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};

		fetchComments();
	}, []);

	return user && token ? (
		<div>
			{state.loading ? (
				<Loader />
			) : (
				<div className="mt-3 border border-gray-600 py-4 px-2 rounded-xl relative">
					{state.hasComment ? (
						<CommentsContext.Provider value={{ state, dispatch }}>
							<div className="max-h-64 overflow-y-auto scrollbar">
								{state.commentsArray.map((comment, id) => (
									<Comment key={id} comment={comment} post={post} />
								))}
							</div>
						</CommentsContext.Provider>
					) : (
						<p className="text-gray-600 mb-2 text-lg ml-5">No comment...</p>
					)}
					<hr className="border-2 border-gray-700 my-3" />
					<CommentsContext.Provider value={{ state, dispatch }}>
						<CommentInput post={post} />
					</CommentsContext.Provider>
				</div>
			)}
		</div>
	) : (
		<Error />
	);
};

export default Comments;
