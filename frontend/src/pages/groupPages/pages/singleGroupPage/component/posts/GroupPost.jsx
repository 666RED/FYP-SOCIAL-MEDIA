import { React, useContext, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs/index.js";
import { FaFile } from "react-icons/fa/index.js";
import { HiThumbUp } from "react-icons/hi/index.js";
import { FaCommentDots } from "react-icons/fa/index.js";
import { MdDeleteForever, MdEdit, MdReportProblem } from "react-icons/md";

import Comments from "../comments/Comments.jsx";
import EditPostForm from "../posts/EditPostForm.jsx";
import OptionDiv from "../../../../../../components/OptionDiv.jsx";
import UserPostHeader from "../../../../../profilePages/components/UserPostHeader.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import {
	groupPostReducer,
	INITIAL_STATE,
} from "../../feature/groupPostReducer.js";
import ACTION_TYPES from "../../actionTypes/groupPostActionTypes.js";
import { ServerContext } from "../../../../../../App.js";
import { removePost } from "../../../../../../features/groupPostSlice.js";

const GroupPost = ({ post }) => {
	const { groupId } = useParams();

	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(groupPostReducer, INITIAL_STATE);
	const { enqueueSnackbar } = useSnackbar();

	const profileImgPath = `${serverURL}/public/images/profile/`;
	const filePath = `${serverURL}/public/images/group-post/`;

	const previous = window.location.pathname;

	// first render
	useEffect(() => {
		dispatch({
			type: ACTION_TYPES.FIRST_RENDER,
			payload: { post, userId: user._id },
		});
	}, []);

	const handleDownload = () => {
		window.open(filePath + post.postFilePath, "_blank");
	};

	const handleLikes = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: true });
			if (!state.isLiked) {
				const res = await fetch(`${serverURL}/group-post/up-likes`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						groupId: groupId,
						postId: post._id,
						userId: user._id,
					}),
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.LIKE_POST,
					});
				} else if (msg === "Fail to update post") {
					enqueueSnackbar("Fail to like the post", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
			} else {
				const res = await fetch(`${serverURL}/group-post/down-likes`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						groupId: groupId,
						postId: post._id,
						userId: user._id,
					}),
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.DISLIKE_POST,
					});
				} else if (msg === "Fail to update post") {
					enqueueSnackbar("Fail to remove the like", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
			}
			dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: false });
		} catch (err) {
			dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: false });
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
			}
			const res = await fetch(`${serverURL}/group-post/delete-post`, {
				method: "DELETE",
				body: JSON.stringify({
					postId: post._id,
					postImagePath: post.postImagePath,
					postFilePath: post.postFilePath,
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
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Post deleted", { variant: "success" });
				sliceDispatch(removePost(post._id));
				dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV });
			} else if (
				msg === "Fail to delete comments" ||
				msg === "Fail to delete post"
			) {
				enqueueSnackbar("Fail to delete post", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	// later add
	const handleReport = async () => {
		console.log("report");
	};

	return (
		<div className="relative my-3 bg-white rounded-xl shadow-2xl py-4 px-2 w-full mx-auto md:w-7/12">
			{state.loading && <Spinner />}
			{/* OPTION DIV */}
			{state.showOptionDiv && (
				<div className="absolute right-3 top-10 border border-gray-600 bg-gray-200">
					{/* EDIT */}
					{post.userId === user._id && (
						<OptionDiv
							icon={<MdEdit />}
							text="Edit"
							func={() =>
								dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_EDIT_POST_FORM })
							}
						/>
					)}
					{/* DELETE */}
					{post.userId === user._id && (
						<OptionDiv
							icon={<MdDeleteForever />}
							text="Delete"
							func={handleDelete}
						/>
					)}
					{/* REPORT */}
					{post.userId !== user._id && (
						<OptionDiv
							func={handleReport}
							icon={<MdReportProblem />}
							text="Report"
						/>
					)}
				</div>
			)}
			{/* EDIT POST FORM */}
			{state.showEditPostForm && (
				<EditPostForm
					post={post}
					toggleShowEditPostForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_EDIT_POST_FORM })
					}
					toggleShowOptionDiv={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })
					}
				/>
			)}
			{/* HEADER */}
			<UserPostHeader
				imgPath={profileImgPath + post.profileImagePath}
				postTime={post.postTime}
				userName={post.userName}
				destination={`/profile/${post.userId}`}
				previous={previous}
			/>
			{/* THREE DOTS */}
			<BsThreeDots
				className="absolute cursor-pointer top-6 right-3"
				onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })}
			/>
			{/* POST DESCRIPTION */}
			<p className="my-3">{post.postDescription}</p>
			{/* POST IMAGE / FILE */}
			{post.postImagePath !== "" ? (
				<img
					src={filePath + post.postImagePath}
					className="rounded-xl mx-auto w-full"
				/>
			) : post.postFilePath !== "" ? (
				<div
					className="items-center  hover:bg-gray-200 cursor-pointer p-2 inline-flex border border-gray-400 rounded-xl"
					onClick={handleDownload}
				>
					<FaFile className="mr-2" />
					<p>{post.postFilePath.split("_").slice(0, -1).join("_")}</p>
				</div>
			) : null}

			{/* LIKE AND COMMENT DIV */}
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
					<p className="justify-self-center">{post.postComments}</p>
				</div>
			</div>
			{/* COMMENTS SECTION */}
			{state.showComment && <Comments post={post} />}
		</div>
	);
};

export default GroupPost;