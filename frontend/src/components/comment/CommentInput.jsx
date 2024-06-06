import { React, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdSend } from "react-icons/md";
import Spinner from "../Spinner/Spinner.jsx";
import {
	commentInputReducer,
	INITIAL_STATE,
} from "./feature/commentInputReducer.js";
import ACTION_TYPES from "./actionTypes/commentInputActionTypes.js";
import { addComment } from "./feature/commentSlice.js";
import { ServerContext } from "../../App.js";

const CommentInput = ({ post }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(commentInputReducer, INITIAL_STATE);

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
					postUserId: post.userId,
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
				sliceDispatch(addComment(savedComment));
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
