import { React, useContext, useEffect, useReducer, createContext } from "react";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs/index.js";
import { HiThumbUp } from "react-icons/hi/index.js";
import { FaCommentDots } from "react-icons/fa/index.js";
import { ServerContext } from "../../../App.js";
import Comments from "./comment/Comments.jsx";
import UserPostHeader from "./UserPostHeader.jsx";
import {
	userPostReducer,
	INITIAL_STATE,
} from "../features/userPosts/userPostReducer.js";
import ACTION_TYPES from "../actionTypes/userPosts/userPostActionTypes.js";
import { useSnackbar } from "notistack";
export const UserPostContext = createContext(null);

const Post = ({ post, postId }) => {
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(userPostReducer, INITIAL_STATE);
	const { enqueueSnackbar } = useSnackbar();

	const profileImgPath = `${serverURL}/public/images/profile/`;
	const postImgPath = `${serverURL}/public/images/post/`;

	useEffect(() => {
		dispatch({
			type: ACTION_TYPES.FIRST_RENDER,
			payload: {
				post,
				postImagePath: postImgPath + post.postImagePath,
			},
		});
	}, []);

	// change later
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

	return (
		<div className="relative my-3 bg-white rounded-xl shadow-2xl py-4 px-2 w-full mx-auto md:w-7/12">
			<BsThreeDots className="absolute cursor-pointer top-6, right-3" />
			<UserPostHeader
				imgPath={profileImgPath + post.userId.userProfile.profileImagePath}
				userName={post.userId.userName}
				postTime={post.postTime}
			/>
			<p className="my-3">{state.postDescription}</p>
			<img src={state.postImagePath} className="rounded-xl mx-auto w-full" />
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
					{/* change later */}
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
					<p className="justify-self-center">{state.commentsCount}</p>
				</div>
			</div>
			{state.showComment && (
				<UserPostContext.Provider value={{ state, dispatch, ACTION_TYPES }}>
					<Comments post={post} />
				</UserPostContext.Provider>
			)}
		</div>
	);
};

export default Post;
