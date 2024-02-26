import { React, useContext, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs/index.js";
import { HiThumbUp } from "react-icons/hi/index.js";
import { FaCommentDots } from "react-icons/fa/index.js";
import { MdDeleteForever, MdEdit } from "react-icons/md";

import Comments from "../comment/Comments.jsx";
import EditPostForm from "./EditPostForm.jsx";
import OptionDiv from "../../../../components/OptionDiv.jsx";
import UserPostHeader from "../UserPostHeader.jsx";
import {
	userPostReducer,
	INITIAL_STATE,
} from "../../features/userPosts/userPostReducer.js";
import ACTION_TYPES from "../../actionTypes/userPosts/userPostActionTypes.js";
import { setCommentsObj } from "../../features/comment/commentSlice.js";
import { ServerContext } from "../../../../App.js";
import { removePost } from "../../features/userPosts/userPostSlice.js";
import Spinner from "../../../../components/Spinner.jsx";

const Post = ({ post }) => {
	const sliceDispatch = useDispatch();
	const { commentsObj } = useSelector((store) => store.comment);
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(userPostReducer, INITIAL_STATE);
	const { enqueueSnackbar } = useSnackbar();

	const profileImgPath = `${serverURL}/public/images/profile/`;
	const postImgPath = `${serverURL}/public/images/post/`;

	useEffect(() => {
		sliceDispatch(
			setCommentsObj({
				commentsCount: post.postComments,
				postId: post._id,
			})
		);

		dispatch({
			type: ACTION_TYPES.FIRST_RENDER,
			payload: {
				post,
			},
		});
	}, []);

	const handleLikes = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: true });
			if (!state.isLiked) {
				const res = await fetch(`${serverURL}/post/up-likes`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						postId: post._id,
					}),
				});

				if (!res.ok) {
					if (res.status === 403) {
						enqueueSnackbar("Access Denied", { variant: "error" });
					} else {
						enqueueSnackbar("Server Error", { variant: "error" });
					}
					return;
				}

				const { msg, updatedPost } = await res.json();

				dispatch({
					type: ACTION_TYPES.LIKE_POST,
				});
			} else {
				const res = await fetch(`${serverURL}/post/down-likes`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						postId: post._id,
					}),
				});

				if (!res.ok) {
					if (res.status === 403) {
						enqueueSnackbar("Access Denied", { variant: "error" });
					} else {
						enqueueSnackbar("Server Error", { variant: "error" });
					}
					return;
				}

				const { msg, updatedPost } = await res.json();

				dispatch({
					type: ACTION_TYPES.DISLIKE_POST,
				});
			}
			dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	const handleDelete = async () => {
		try {
			const answer = window.confirm("Delete post?");
			if (answer) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(`${serverURL}/post/delete-post`, {
					method: "DELETE",
					body: JSON.stringify({ post: post }),
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
					enqueueSnackbar("Post deleted", { variant: "success" });
					sliceDispatch(removePost(post._id));
					dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV });
				}
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="relative my-3 bg-white rounded-xl shadow-2xl py-4 px-2 w-full mx-auto md:w-7/12">
			{state.loading && <Spinner />}
			{/* OPTION DIV */}
			{state.showOptionDiv && (
				<div className="absolute right-3 top-10 border border-gray-600 bg-gray-200">
					{/* EDIT */}
					<OptionDiv
						icon={<MdEdit />}
						text="Edit"
						func={() =>
							dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_EDIT_POST_FORM })
						}
					/>
					{/* DELETE */}
					<OptionDiv
						icon={<MdDeleteForever />}
						text="Delete"
						func={handleDelete}
					/>
				</div>
			)}
			{/* EDIT POST FORM */}
			{state.showEditPostForm && (
				<EditPostForm
					toggleShowEditPostForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_EDIT_POST_FORM })
					}
					toggleShowOptionDiv={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })
					}
					post={post}
				/>
			)}

			{/* HEADER */}
			<UserPostHeader
				imgPath={profileImgPath + post.userId.userProfile.profileImagePath}
				userName={post.userId.userName}
				postTime={post.postTime}
			/>
			<BsThreeDots
				className="absolute cursor-pointer top-6 right-3"
				onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })}
			/>

			{/* POST DESCRIPTION */}
			<p className="my-3">{post.postDescription}</p>
			{/* POST IMAGE */}
			{post.postImagePath !== "" && (
				<img
					src={postImgPath + post.postImagePath}
					className="rounded-xl mx-auto w-full"
				/>
			)}

			<div className="grid grid-cols-11 mt-3">
				{/* LIKE */}
				<div
					className="col-span-5 border border-black rounded-xl cursor-pointer grid grid-cols-3 py-2 hover:bg-gray-200"
					onClick={() => !state.processing && handleLikes()}
				>
					<div
						className={`justify-self-center text-xl ${
							state.isLiked && "text-blue-600"
						}`}
					>
						<HiThumbUp />
					</div>
					<h6 className="justify-self-center text-sm sm:text-base">Likes</h6>
					<p className="justify-self-center">{state.likesCount}</p>
				</div>

				{/* COMMENT */}
				<div
					className="col-span-5 col-start-7 border border-black rounded-xl grid grid-cols-3 py-2 cursor-pointer hover:bg-gray-200"
					onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_COMMENT })}
				>
					<div className="text-xl justify-self-center">
						<FaCommentDots />
					</div>
					<h6 className="justify-self-center text-sm sm:text-base">Comments</h6>
					<p className="justify-self-center">{commentsObj[post._id]}</p>
				</div>
			</div>
			{state.showComment && <Comments post={post} />}
		</div>
	);
};

export default Post;
