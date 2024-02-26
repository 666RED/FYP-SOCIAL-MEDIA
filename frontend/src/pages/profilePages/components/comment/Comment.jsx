import { React, useContext, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs/index.js";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import UserPostHeader from "../UserPostHeader.jsx";
import OptionDiv from "../../../../components/OptionDiv.jsx";
import EditCommentForm from "./EditCommentForm.jsx";
import Spinner from "../../../../components/Spinner.jsx";
import {
	commentReducer,
	INITIAL_STATE,
} from "../../features/comment/commentReducer.js";
import ACTION_TYPES from "../../actionTypes/comment/commentActionTypes.js";
import {
	decreaseCommentCount,
	updateComment,
} from "../../features/comment/commentSlice.js";
import { ServerContext } from "../../../../App.js";

const Comment = ({ comment, post }) => {
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const profileImgPath = `${serverURL}/public/images/profile/`;
	const { user, token } = useSelector((store) => store.auth);
	const { commentsArray } = useSelector((store) => store.comment);
	const [state, dispatch] = useReducer(commentReducer, INITIAL_STATE);

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

				if (!res.ok) {
					if (res.status === 403) {
						enqueueSnackbar("Access Denied", { variant: "error" });
					} else {
						enqueueSnackbar("Server Error", { variant: "error" });
					}
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Comment deleted", { variant: "success" });
					sliceDispatch(decreaseCommentCount({ postId: post._id }));
					dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS });

					// find the current commentObj
					const comments = commentsArray.filter(
						(commentObj) => commentObj.postId === post._id
					)[0].comments;

					sliceDispatch(
						updateComment({
							postId: post._id,
							newCommentArray: comments.filter(
								(inStateComment) => inStateComment._id != comment._id
							),
						})
					);
					// check if no comment (add on)
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
				imgPath={profileImgPath + comment.userId.userProfile.profileImagePath}
				userName={comment.userId.userName}
				postTime={comment.commentTime}
				isPost={false}
			/>

			{/* THREE DOTS */}
			{user._id === comment.userId._id && (
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
					<OptionDiv
						icon={<MdEdit />}
						text="Edit"
						func={() =>
							dispatch({ type: ACTION_TYPES.TOGGLE_EDIT_COMMENT_FORM })
						}
					/>
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
