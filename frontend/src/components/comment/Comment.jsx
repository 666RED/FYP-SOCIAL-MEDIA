import { React, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs/index.js";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import UserPostHeader from "../../pages/profilePages/components/UserPostHeader.jsx";
import OptionDiv from "../OptionDiv.jsx";
import EditCommentForm from "./EditCommentForm.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import { commentReducer, INITIAL_STATE } from "./feature/commentReducer.js";
import ACTION_TYPES from "./actionTypes/commentActionTypes.js";
import { deleteComment } from "./feature/commentSlice.js";
import { ServerContext } from "../../App.js";

const Comment = ({ comment, post }) => {
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const profileImgPath = `${serverURL}/public/images/profile/`;
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(commentReducer, INITIAL_STATE);

	const previous = window.location.pathname;

	const handleDelete = async () => {
		try {
			const answer = window.confirm("Delete comment?");
			if (answer) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(`${serverURL}/comment/delete-comment`, {
					method: "DELETE",
					body: JSON.stringify({ commentId: comment._id, postId: post._id }),
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
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, deletedCommentId } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Comment deleted", { variant: "success" });
					dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS });
					sliceDispatch(deleteComment(deletedCommentId));
				} else if (msg === "Fail to delete comment") {
					enqueueSnackbar("Fail to delete comment", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	return (
		<div className="border border-gray-600 rounded-xl p-2 mb-3 relative">
			{state.loading && <Spinner />}
			{/* USER INFO */}
			<UserPostHeader
				imgPath={profileImgPath + comment.profileImagePath}
				userName={comment.userName}
				postTime={comment.time}
				isPost={false}
				destination={`/profile/${comment.userId}`}
				previous={previous}
				frameColor={comment.frameColor}
			/>

			{/* THREE DOTS */}
			{(user._id === comment.userId || post.userId._id === user._id) && (
				<div
					className="absolute right-2 top-1 cursor-pointer"
					onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS })}
				>
					<BsThreeDots />
				</div>
			)}

			{/* OPTIONS DIV */}
			{state.showOptions && (
				<div className="absolute right-2 top-5 border border-gray-600 bg-gray-200">
					{/* EDIT */}
					{user._id === comment.userId && (
						<OptionDiv
							icon={<MdEdit />}
							text="Edit"
							func={() =>
								dispatch({ type: ACTION_TYPES.TOGGLE_EDIT_COMMENT_FORM })
							}
						/>
					)}

					{/* DELETE */}
					<OptionDiv
						icon={<MdDeleteForever />}
						text="Delete"
						func={handleDelete}
					/>
				</div>
			)}

			{/* COMMENT */}
			<p className="bg-gray-200 rounded-xl p-2 mt-2">
				{comment.commentDescription}
			</p>

			{/* EDIT COMMENT FORM */}
			{state.showEditCommentForm && (
				<EditCommentForm
					toggleEditCommentForm={() =>
						dispatch({
							type: ACTION_TYPES.TOGGLE_EDIT_COMMENT_FORM,
						})
					}
					comment={comment}
					toggleShowOptions={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS })
					}
				/>
			)}
		</div>
	);
};

export default Comment;
