import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Comment from "../comments/Comment.jsx";
import CommentInput from "../comments/CommentInput.jsx";
import Loader from "../../../../../../components/Spinner/Loader.jsx";
import LoadMoreButton from "../../../../../../components/LoadMoreButton.jsx";
// slice
import { ServerContext } from "../../../../../../App.js";
import {
	loadComments,
	pushComments,
	removeComment,
} from "../../../../../../features/groupPostSlice.js";

const Comments = ({ post }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { isMember } = useSelector((store) => store.group);
	const { commentsArray } = useSelector((store) => store.groupPost);
	const { enqueueSnackbar } = useSnackbar();
	const [hasComment, setHasComment] = useState(false);
	const [loadMore, setLoadMore] = useState(false);
	const [isLoadingComment, setIsLoadingComment] = useState(false);
	const [count, setCount] = useState(10);

	const currentTime = new Date();
	currentTime.setSeconds(currentTime.getSeconds() + 1);
	const updatedTime = currentTime.toUTCString();

	// get 10 comments and reset state
	useEffect(() => {
		const fetchComments = async () => {
			try {
				setIsLoadingComment(true);
				const res = await fetch(
					`${serverURL}/group-post-comment/get-comments?postId=${post._id}`,
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

				const { msg, returnComments } = await res.json();

				if (msg === "Success") {
					sliceDispatch(pushComments(returnComments));

					if (returnComments.length < 10) {
						setHasComment(false);
					} else {
						setHasComment(true);
					}
				} else if (msg === "No comment") {
					setHasComment(false);
				} else if (msg === "Fail to retrieve comments") {
					enqueueSnackbar("Fail to retreive comments", { variant: "error" });
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

	// remove comment from array
	useEffect(() => {
		return () => {
			sliceDispatch(removeComment(post._id));
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/group-post-comment/get-comments?postId=${post._id}&count=${count}&currentTime=${updatedTime}`,
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

			const { msg, returnComments } = await res.json();
			if (msg === "Success") {
				sliceDispatch(loadComments(returnComments));
				setCount((prevCount) => prevCount + 10);
				if (returnComments.length < 10) {
					setHasComment(false);
				} else {
					setHasComment(true);
				}
			} else if (msg == "Fail to retrieve comments") {
				enqueueSnackbar("Fail to retrieve comments", {
					variant: "error",
				});
			} else if (msg === "No comment") {
				setHasComment(false);
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			setLoadMore(false);
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<div>
			{isLoadingComment ? (
				<Loader />
			) : (
				<div className="mt-3 border border-gray-600 py-4 px-2 rounded-xl relative">
					{/* COMMENTS */}
					<div className="max-h-64 overflow-y-auto scrollbar">
						{commentsArray.map(
							(comment) =>
								comment.groupPostId === post._id && (
									<Comment key={comment._id} comment={comment} post={post} />
								)
						)}
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
					{isMember && <CommentInput post={post} />}
				</div>
			)}
		</div>
	);
};

export default Comments;
