import {
	React,
	useContext,
	useEffect,
	useReducer,
	useState,
	useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs/index.js";
import { HiThumbUp } from "react-icons/hi/index.js";
import { FaCommentDots } from "react-icons/fa/index.js";
import { MdDeleteForever, MdEdit, MdReportProblem } from "react-icons/md";
import Comments from "../comment/Comments.jsx";
import EditPostForm from "./EditPostForm.jsx";
import ReportForm from "./ReportForm.jsx";
import OptionDiv from "../OptionDiv.jsx";
import UserPostHeader from "../../pages/profilePages/components/UserPostHeader.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import FocusImage from "../../pages/adminPages/components/FocusImage.jsx";
import { postReducer, INITIAL_STATE } from "./feature/postReducer.js";
import ACTION_TYPES from "./actionTypes/userPostActionTypes.js";
import { removePost, updatePost } from "../../features/postSlice.js";
import { ServerContext } from "../../App.js";

const Post = ({ post, view = 0 }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
	const { enqueueSnackbar } = useSnackbar();
	const [showImage, setShowImage] = useState(false);
	const optionDivRef = useRef();

	const previous = window.location.pathname;

	// first render
	useEffect(() => {
		dispatch({
			type: ACTION_TYPES.FIRST_RENDER,
			payload: {
				post,
				userId: user._id,
			},
		});
	}, []);

	const handleLikes = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_PROCESSING, payload: true });
			if (!state.isLiked) {
				dispatch({
					type: ACTION_TYPES.LIKE_POST,
				});
				new Audio("/like-sound.mp3").play();

				const res = await fetch(`${serverURL}/post/up-likes`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
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
				} else if (msg === "Post not found") {
					dispatch({ type: ACTION_TYPES.SET_IS_LIKED, payload: false });
					enqueueSnackbar("Post not found", { variant: "error" });
				} else if (msg === "Fail to update post") {
					dispatch({ type: ACTION_TYPES.SET_IS_LIKED, payload: false });
					enqueueSnackbar("Fail to like the post", { variant: "error" });
				} else {
					dispatch({ type: ACTION_TYPES.SET_IS_LIKED, payload: false });
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
			} else {
				dispatch({
					type: ACTION_TYPES.DISLIKE_POST,
				});
				const res = await fetch(`${serverURL}/post/down-likes`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
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
				} else if (msg === "Post not found") {
					dispatch({ type: ACTION_TYPES.SET_IS_LIKED, payload: true });
					enqueueSnackbar("Post not found", {
						variant: "error",
					});
				} else if (msg === "Fail to update post") {
					dispatch({ type: ACTION_TYPES.SET_IS_LIKED, payload: true });
					enqueueSnackbar("Fail to remove the like", {
						variant: "error",
					});
				} else {
					dispatch({ type: ACTION_TYPES.SET_IS_LIKED, payload: true });
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
				const res = await fetch(`${serverURL}/post/delete-post`, {
					method: "DELETE",
					body: JSON.stringify({ postId: post._id }),
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
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleReport = () => {
		dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_POST_FORM });
	};

	// close option divs
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				optionDivRef.current &&
				!optionDivRef.current.contains(event.target)
			) {
				dispatch({ type: ACTION_TYPES.CLOSE_OPTION_DIV });
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative my-3 bg-white rounded-xl shadow-2xl py-4 px-2 component-layout">
			{state.loading && <Spinner />}
			{/* OPTION DIV */}
			{state.showOptionDiv && (
				<div
					className="absolute right-3 top-10 border border-gray-600 bg-gray-200"
					ref={optionDivRef}
				>
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
					toggleShowEditPostForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_EDIT_POST_FORM })
					}
					toggleShowOptionDiv={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })
					}
					post={post}
					updatePost={updatePost}
				/>
			)}
			{/* REPORT FORM */}
			{state.showReportPostForm && (
				<ReportForm
					toggleShowOptionDiv={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })
					}
					toggleShowReportForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_POST_FORM })
					}
					id={post._id}
				/>
			)}
			{/* FOCUS IMAGE */}
			{showImage && (
				<FocusImage
					imagePath={post.postImagePath}
					setShowImage={setShowImage}
				/>
			)}
			{/* HEADER */}
			<UserPostHeader
				imgPath={post.profileImagePath}
				userName={post.userName}
				frameColor={post.frameColor}
				postTime={post.time}
				destination={`/profile/${post.userId}`}
				previous={previous}
			/>
			{/* THREE DOTS */}
			{view == 0 && (
				<BsThreeDots
					className="absolute cursor-pointer top-6 right-3"
					onClick={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })
					}
				/>
			)}

			{/* POST DESCRIPTION */}
			<p className="my-3">{post.postDescription}</p>
			{/* POST IMAGE */}
			{post.postImagePath !== "" && (
				<img
					alt="Post Image"
					src={post.postImagePath}
					className="rounded-xl mx-auto max-img-height cursor-pointer"
					onClick={() => setShowImage(true)}
				/>
			)}
			{/* LIKE AND COMMENT DIV */}
			{view == 0 && (
				<div className="grid grid-cols-11 mt-3">
					{/* LIKE */}
					<div
						className="col-span-5 border border-black rounded-xl cursor-pointer hover:bg-gray-200 grid grid-cols-3 py-2"
						onClick={() => !state.processing && handleLikes()}
					>
						<div
							className={`justify-self-center text-xl select-none transition-all ${
								state.isLiked && "text-blue-600 scale-animation"
							}`}
						>
							<HiThumbUp />
						</div>
						<h6 className="justify-self-center text-sm sm:text-base select-none">
							Likes
						</h6>
						<p className="justify-self-center select-none">
							{state.likesCount}
						</p>
					</div>

					{/* COMMENT */}
					<div
						className="col-span-5 col-start-7 border border-black rounded-xl grid grid-cols-3 py-2 cursor-pointer hover:bg-gray-200"
						onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_COMMENT })}
					>
						<div className="text-xl justify-self-center select-none">
							<FaCommentDots />
						</div>
						<h6 className="justify-self-center text-sm sm:text-base select-none">
							Comments
						</h6>
						<p className="justify-self-center select-none">
							{post.postComments}
						</p>
					</div>
				</div>
			)}

			{/* COMMENTS SECTION */}
			{view == 0 && state.showComment && <Comments post={post} />}
		</div>
	);
};

export default Post;
