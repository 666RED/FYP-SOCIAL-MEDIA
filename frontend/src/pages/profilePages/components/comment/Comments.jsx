import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import CommentInput from "./CommentInput.jsx";
import Loader from "../../../../components/Spinner/Loader.jsx";
import Error from "../../../../components/Error.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import { ServerContext } from "../../../../App.js";
import { useSnackbar } from "notistack";
import {
	pushComment,
	noComment,
	removeComment,
	loadComments,
} from "../../features/comment/commentSlice.js";

const Comments = ({ post }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [hasComment, setHasComment] = useState(false);
	const [loadMore, setLoadMore] = useState(false);
	const [isLoadingComment, setIsLoadingComment] = useState(false);
	const [count, setCount] = useState(10);
	const { commentsArray } = useSelector((store) => store.comment);
	const currentTime = new Date();
	currentTime.setSeconds(currentTime.getSeconds() + 1); // make sure newly added condition can be retrieved from db
	const updatedTime = currentTime.toUTCString();

	// get 10 comments and reset state
	useEffect(() => {
		const fetchComments = async () => {
			setIsLoadingComment(true);
			try {
				const res = await fetch(
					`${serverURL}/comment/get-comments?postId=${post._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setIsLoadingComment(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, comments } = await res.json();

				if (msg === "Success") {
					sliceDispatch(pushComment({ postId: post._id, comments }));

					if (comments.length < 10) {
						setHasComment(false);
					} else {
						setHasComment(true);
					}
				} else if (msg === "No comment") {
					sliceDispatch(noComment(post._id));
				} else if (msg === "Comment not found") {
					enqueueSnackbar("Comment not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setIsLoadingComment(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setIsLoadingComment(false);
			}
		};

		fetchComments();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(removeComment(post._id));
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/comment/get-comments?postId=${post._id}&count=${count}&currentTime=${updatedTime}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, comments } = await res.json();

			if (msg === "Success") {
				sliceDispatch(loadComments(comments));

				if (comments.length < 10) {
					setHasComment(false);
				} else {
					setHasComment(true);
				}
				setCount((prevCount) => prevCount + 10);
			} else if (msg === "No comment") {
				sliceDispatch(noComment(post._id));
				setHasComment(false);
			} else if (msg === "Comment not found") {
				enqueueSnackbar("Comment not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});

			setLoadMore(false);
		}
	};

	return user && token ? (
		<div>
			{isLoadingComment ? (
				<Loader />
			) : (
				<div className="mt-3 border border-gray-600 py-4 px-2 rounded-xl relative">
					{/* COMMENTS */}
					<div className="max-h-64 overflow-y-auto scrollbar">
						{commentsArray.map((commentObj) => {
							if (commentObj.postId === post._id) {
								return commentObj.comments.map((comment, commentId) => (
									<Comment key={commentId} comment={comment} post={post} />
								));
							}
						})}
						{/* LOAD MORE BUTTON */}
						<LoadMoreButton
							handleLoadMore={handleLoadMore}
							hasComponent={hasComment}
							isLoadingComponent={isLoadingComment}
							loadMore={loadMore}
						/>
					</div>
					<hr className="border-2 border-gray-700 my-3" />
					{/* COMMENT INPUT */}
					<CommentInput post={post} />
				</div>
			)}
		</div>
	) : (
		<Error />
	);
};

export default Comments;
