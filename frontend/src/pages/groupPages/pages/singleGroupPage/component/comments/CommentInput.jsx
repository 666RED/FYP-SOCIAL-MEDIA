import { React, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdSend } from "react-icons/md";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import {
	commentInputReducer,
	INITIAL_STATE,
} from "../../feature/commentInputReducer.js";
import ACTION_TYPES from "../../actionTypes/commentInputActionTypes.js";
import { addComment } from "../../../../../../features/groupPostSlice.js";
import { ServerContext } from "../../../../../../App.js";

const CommentInput = ({ post }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(commentInputReducer, INITIAL_STATE);

	const handleSend = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const res = await fetch(
				`${serverURL}/group-post-comment/add-group-post-comment`,
				{
					method: "POST",
					body: JSON.stringify({
						groupPostId: post._id,
						userId: user._id,
						comment: state.comment,
					}),
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
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnComment } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addComment(returnComment));
				dispatch({ type: ACTION_TYPES.SENT_COMMENT });
				enqueueSnackbar("Comment posted", { variant: "success" });
			} else if (
				msg === "Fail to add new comment" ||
				msg === "User not found"
			) {
				enqueueSnackbar("Fail to add new comment", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({
				type: ACTION_TYPES.SET_LOADING,
				payload: false,
			});
		} catch (err) {
			dispatch({
				type: ACTION_TYPES.SET_LOADING,
				payload: false,
			});
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<form className="grid grid-cols-2" onSubmit={handleSend}>
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
			<button className="mt-3 col-start-2 justify-self-end">
				<MdSend className="icon" />
			</button>
		</form>
	);
};

export default CommentInput;
