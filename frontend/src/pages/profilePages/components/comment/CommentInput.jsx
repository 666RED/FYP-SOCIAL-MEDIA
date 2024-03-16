import { React, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdSend } from "react-icons/md";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../../App.js";
import { useSnackbar } from "notistack";
import {
	commentInputReducer,
	INITIAL_STATE,
} from "../../features/comment/commentInputReducer.js";
import ACTION_TYPES from "../../actionTypes/comment/commentInputActionTypes.js";
import { addComment } from "../../features/comment/commentSlice.js";

const CommentInput = ({ post }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(commentInputReducer, INITIAL_STATE);
	const { commentsArray } = useSelector((store) => store.comment);

	const handleSend = async (e) => {
		e.preventDefault();
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		try {
			dispatch({
				type: ACTION_TYPES.SET_IS_PROCESSING,
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

			if (!res.ok && res.status === 403) {
				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
				dispatch({
					type: ACTION_TYPES.SET_IS_PROCESSING,
					payload: false,
				});
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, savedComment } = await res.json();

			if (msg === "Success") {
				const response = await fetch(
					`${serverURL}/comment/get-comment?commentId=${savedComment._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					dispatch({
						type: ACTION_TYPES.SET_LOADING,
						payload: false,
					});
					dispatch({
						type: ACTION_TYPES.SET_IS_PROCESSING,
						payload: false,
					});
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, comment } = await response.json();

				if (msg === "Success") {
					sliceDispatch(
						addComment({
							postId: post._id,
							newComment: comment,
						})
					);
				} else if (msg === "Comment not found") {
					enqueueSnackbar("Comment not found", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({
					type: ACTION_TYPES.SENT_COMMENT,
				});

				enqueueSnackbar("Comment posted", { variant: "success" });
			} else if (msg === "Fail to add new comment") {
				enqueueSnackbar("Fail to add new comment", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({
				type: ACTION_TYPES.SET_IS_PROCESSING,
				payload: false,
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	return (
		<form className="grid grid-cols-2" onSubmit={(e) => handleSend(e)}>
			{state.loading && <Spinner />}
			<input
				maxLength={200}
				type="text"
				placeholder="Leave a comment"
				className="w-full rounded-full col-span-2"
				required
				value={state.comment}
				onChange={(e) =>
					dispatch({
						type: ACTION_TYPES.SET_COMMENT,
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
