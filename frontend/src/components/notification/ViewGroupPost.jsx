import { React, useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "../Spinner/Loader.jsx";
import GroupPost from "../../pages/groupPages/pages/singleGroupPage/component/posts/GroupPost.jsx";
import DirectBackArrowHeader from "../BackArrow/DirectBackArrowHeader.jsx";
import { ServerContext } from "../../App.js";

const ViewGroupPost = () => {
	const { postId } = useParams();
	const [post, setPost] = useState({});
	const [loading, setLoading] = useState(false);
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const getPost = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/group-post/get-group-post?postId=${postId}`,
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

				const { msg, returnGroupPost } = await res.json();

				if (msg === "Success") {
					setPost(returnGroupPost);
				} else if (msg === "Fail to get post") {
					enqueueSnackbar("Fail to get post", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};

		getPost();
	}, []);

	return (
		<div className="px-3 py-2">
			{loading ? (
				<Loader />
			) : (
				<div>
					<DirectBackArrowHeader destination="/home" title="View Group Post" />
					<GroupPost post={post} viewPost={true} />
				</div>
			)}
		</div>
	);
};

export default ViewGroupPost;
