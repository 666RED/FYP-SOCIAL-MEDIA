import { React, useContext, useReducer } from "react";
import { useSelector } from "react-redux";
import { MdSend } from "react-icons/md";
import { ServerContext } from "../../../../App.js";
import { useSnackbar } from "notistack";
import { CommentsContext } from "./Comments.jsx";
import ACTION_TYPES from "../../actionTypes/comment/commentsActionTypes.js";
import {
	commentInputReducer,
	INITIAL_STATE,
} from "../../features/comment/commentInputReducer.js";
import COMMENT_INPUT_ACTION_TYPES from "../../actionTypes/comment/commentInputActionTypes.js";
import { UserPostContext } from "../UserPost.jsx";

const CommentInput = ({ post }) => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const commentReducer = useContext(CommentsContext);
	const [state, dispatch] = useReducer(commentInputReducer, INITIAL_STATE);
	const userPostReducer = useContext(UserPostContext);

	const handleSend = async (e) => {
		e.preventDefault();
		try {
			dispatch({
				type: COMMENT_INPUT_ACTION_TYPES.SET_IS_PROCESSING,
				payload: true,
			});
			const res = await fetch(`${serverURL}/comment/add-comment`, {
				method: "POST",
				body: JSON.stringify({
					postId: post._id,
					userId: user._id,
					comment: state.comment,
				}),
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

			const { msg, savedComment } = await res.json();

			if (msg === "Success") {
				const response = await fetch(`${serverURL}/comment/get-comment`, {
					method: "POST",
					body: JSON.stringify({
						commentId: savedComment._id,
					}),
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

				const { msg, comment } = await response.json();

				if (msg === "Success") {
					commentReducer.dispatch({
						type: ACTION_TYPES.ADD_NEW_COMMENT,
						payload: comment,
					});
					commentReducer.dispatch({
						type: ACTION_TYPES.SET_HAS_COMMENT,
						payload: true,
					});
				}

				dispatch({
					type: COMMENT_INPUT_ACTION_TYPES.SENT_COMMENT,
				});

				userPostReducer.dispatch({
					type: userPostReducer.ACTION_TYPES.INCREASE_COMMENTS_COUNT,
				});
				enqueueSnackbar("Comment posted", { variant: "success" });
			}
		} catch (err) {
			console.log(err);

			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({
				type: COMMENT_INPUT_ACTION_TYPES.SET_IS_PROCESSING,
				payload: false,
			});
		}
	};

	return (
		<form className="grid grid-cols-2" onSubmit={(e) => handleSend(e)}>
			<input
				maxLength={200}
				type="text"
				placeholder="Leave a comment"
				className="w-full rounded-full col-span-2"
				required
				value={state.comment}
				onChange={(e) =>
					dispatch({
						type: COMMENT_INPUT_ACTION_TYPES.SET_COMMENT,
						payload: e.target.value,
					})
				}
			/>
			<button
				className="mt-3 col-start-2 justify-self-end"
				disabled={state.isProcessing}
			>
				<MdSend className="icon" />
			</button>
		</form>
	);
};

export default CommentInput;
