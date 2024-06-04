import { React, useContext, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import UserPostHeader from "../../../../../profilePages/components/UserPostHeader.jsx";
import OptionDiv from "../../../../../../components/OptionDiv.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import EditCommentForm from "../comments/EditCommentForm.jsx";
import { commentReducer, INITIAL_STATE } from "../../feature/commentReducer.js";
import ACTION_TYPES from "../../actionTypes/commentActionTypes.js";
import { ServerContext } from "../../../../../../App.js";
import { deleteComment } from "../../../../../../features/groupPostSlice.js";

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
				const res = await fetch(
					`${serverURL}/group-post-comment/delete-comment`,
					{
						method: "DELETE",
						body: JSON.stringify({ commentId: comment._id, postId: post._id }),
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

				const { msg, deletedCommentId } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Comment deleted", { variant: "success" });
					dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS });
					sliceDispatch(deleteComment(deletedCommentId));
				} else if (msg === "Fail to delete comment") {
					enqueueSnackbar("Fail to delete comment", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({
				type: ACTION_TYPES.SET_LOADING,
				payload: false,
			});
		}
	};

	return (
		<div className="border border-gray-600 rounded-xl p-2 mb-3 relative">
			{state.loading && <Spinner />}
			{/* USER INFO */}
			<UserPostHeader
				imgPath={profileImgPath + comment.profileImagePath}
				postTime={comment.time}
				userName={comment.userName}
				destination={`/profile/${comment.userId}`}
				isPost={false}
				previous={previous}
				frameColor={comment.frameColor}
			/>
			{/* THREE DOTS */}
			{(user._id === comment.userId || post.userId === user._id) && (
				<BsThreeDots
					className="absolute right-2 top-1 cursor-pointer"
					onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS })}
				/>
			)}
			{/* OPTION DIV */}
			{state.showOptions && (
				<div className="absolute right-2 top-5 border border-gray-600 bg-gray-200">
					{/* EDIT */}
					{user._id === comment.userId && (
						<OptionDiv
							func={() =>
								dispatch({ type: ACTION_TYPES.TOGGLE_EDIT_COMMENT_FORM })
							}
							icon={<MdEdit />}
							text="Edit"
						/>
					)}
					{/* DELETE */}
					<OptionDiv
						func={handleDelete}
						icon={<MdDeleteForever />}
						text="Delete"
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
					comment={comment}
					toggleEditCommentForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_EDIT_COMMENT_FORM })
					}
					toggleShowOptions={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS })
					}
				/>
			)}
		</div>
	);
};

export default Comment;
