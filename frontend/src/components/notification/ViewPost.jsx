import { React, useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Error from "../Error.jsx";
import Loader from "../Spinner/Loader.jsx";
import Post from "../post/Post.jsx";
import DirectBackArrowHeader from "../BackArrow/DirectBackArrowHeader.jsx";
import { ServerContext } from "../../App.js";

const ViewPost = () => {
	const serverURL = useContext(ServerContext);
	const [loading, setLoading] = useState(false);
	const { user, token } = useSelector((store) => store.auth);
	const { postId, report } = useParams();
	const [post, setPost] = useState({});
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const getPost = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/post/get-post?postId=${postId}&userId=${user._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnedPost } = await res.json();

				if (msg === "Success") {
					setPost(returnedPost);
				} else if (msg === "Fail to get post") {
					enqueueSnackbar("Fail to get post", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				setLoading(false);
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};

		getPost();
	}, []);

	return user && token ? (
		<div className="px-3 py-2">
			{loading ? (
				<Loader />
			) : (
				<div>
					<DirectBackArrowHeader destination={"/home/0"} title="View Post" />
					<Post post={post} view={report} />
				</div>
			)}
		</div>
	) : (
		<Error />
	);
};

export default ViewPost;
