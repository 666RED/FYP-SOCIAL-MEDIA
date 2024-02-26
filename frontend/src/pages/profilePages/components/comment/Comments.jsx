import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import CommentInput from "./CommentInput.jsx";
import Loader from "../../../../components/Loader.jsx";
import Error from "../../../../components/Error.jsx";
import { ServerContext } from "../../../../App.js";
import { useSnackbar } from "notistack";
import { gotComment, noComment } from "../../features/comment/commentSlice.js";

const Comments = ({ post }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const { commentsArray } = useSelector((store) => store.comment);

	useEffect(() => {
		const fetchComments = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${serverURL}/comment/get-comments`, {
					method: "POST",
					body: JSON.stringify({ postId: post._id }),
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

				const { msg, comments } = await res.json();

				if (msg === "Success") {
					sliceDispatch(gotComment({ postId: post._id, comments }));
				} else if (msg === "No comment") {
					sliceDispatch(noComment(post._id));
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};

		fetchComments();
	}, []);

	return user && token ? (
		<div>
			{loading ? (
				<Loader />
			) : (
				<div className="mt-3 border border-gray-600 py-4 px-2 rounded-xl relative">
					<div className="max-h-64 overflow-y-auto scrollbar">
						{commentsArray.map((commentObj, id) => {
							if (commentObj.postId === post._id) {
								return commentObj.comments.map((comment, commentId) => (
									<Comment key={commentId} comment={comment} post={post} />
								));
							}
						})}
					</div>
					<hr className="border-2 border-gray-700 my-3" />
					<CommentInput post={post} />
				</div>
			)}
		</div>
	) : (
		<Error />
	);
};

export default Comments;
