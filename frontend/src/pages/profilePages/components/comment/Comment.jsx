import { React, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserPostHeader from "../UserPostHeader.jsx";
import { BsThreeDots } from "react-icons/bs/index.js";
import { MdDeleteForever } from "react-icons/md";
import { CommentsContext } from "./Comments.jsx";
import { ServerContext } from "../../../../App.js";
import {
	commentReducer,
	INITIAL_STATE,
} from "../../features/comment/commentReducer.js";
import ACTION_TYPES from "../../actionTypes/comment/commentActionTypes.js";
import USER_POST_ACTION_TYPES from "../../actionTypes/userPosts/userPostActionTypes.js";
import COMMENTS_ACTION_TYPES from "../../actionTypes/comment/commentsActionTypes.js";

import { useSnackbar } from "notistack";
import { UserPostContext } from "../UserPost.jsx";

const Comment = ({ comment, post }) => {
	const { enqueueSnackbar } = useSnackbar();
	const commentsReducer = useContext(CommentsContext);
	const userPostReducer = useContext(UserPostContext);
	const serverURL = useContext(ServerContext);
	const profileImgPath = `${serverURL}/public/images/profile/`;
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(commentReducer, INITIAL_STATE);

	const handleDelete = async () => {
		try {
			const answer = window.confirm("Delete comment?");
			if (answer) {
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
					dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS });
					userPostReducer.dispatch({
						type: USER_POST_ACTION_TYPES.DECREASE_COMMENTS_COUNT,
					});
					commentsReducer.dispatch({
						type: COMMENTS_ACTION_TYPES.SET_COMMENTS_ARRAY,
						payload: commentsReducer.state.commentsArray.filter(
							(inStateComment) => inStateComment._id != comment._id
						),
					});
					// check if no comment (add on)
				}
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<div className="border border-gray-600 rounded-xl p-2 mb-3 relative">
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
				<div
					className="absolute right-2 top-5 flex items-center border border-gray-600 bg-gray-200 p-1 cursor-pointer hover:opacity-80"
					onClick={() => handleDelete()}
				>
					<div className="text-lg ">
						<MdDeleteForever />
					</div>
					<p className="ml-2">Delete</p>
				</div>
			)}
			{/* USER INFO */}
			<UserPostHeader
				imgPath={profileImgPath + comment.userId.userProfile.profileImagePath}
				userName={comment.userId.userName}
				postTime={comment.commentTime}
			/>
			{/* COMMENT */}
			<p className="bg-gray-200 rounded-xl p-2 mt-2">
				{comment.commentDescription}
			</p>
		</div>
	);
};

export default Comment;
