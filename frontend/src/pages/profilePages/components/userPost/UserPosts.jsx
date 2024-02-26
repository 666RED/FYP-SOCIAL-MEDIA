import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./UserPost.jsx";
import Loader from "../../../../components/Loader.jsx";
import { ServerContext } from "../../../../App.js";
import { enqueueSnackbar } from "notistack";
import { setPost } from "../../features/userPosts/userPostSlice.js";

const UserPosts = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { posts } = useSelector((store) => store.post);
	const [loading, setLoading] = useState(false);
	const [hasPost, setHasPost] = useState(false);

	useEffect(() => {
		const getPost = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/post/get-posts`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userId: user._id,
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

				const { msg, posts } = await res.json();

				if (msg === "No post") {
					setHasPost(false);
				} else if (msg === "Success") {
					sliceDispatch(setPost(posts));
					setHasPost(true);
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
		<div>
			{loading ? (
				<Loader />
			) : (
				<div className="bg-gray-200 w-full py-1 px-3">
					{hasPost || posts.length > 0 ? (
						posts.map((post) => <Post key={post._id} post={post} />)
					) : (
						<h2 className="text-center my-2">No post</h2>
					)}
				</div>
			)}
		</div>
	);
};

export default UserPosts;
