import { React, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../components/Spinner/Loader.jsx";
import Post from "../../../components/post/Post.jsx";
import { ServerContext } from "../../../App.js";
import {
	setPosts,
	setHasPosts,
	setIsLoadingPosts,
	resetState,
} from "../../../features/postSlice.js";

const Posts = () => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const sliceDispatch = useDispatch();
	const { isLoadingPosts, hasPosts, posts } = useSelector(
		(store) => store.post
	);

	// get home posts
	useEffect(() => {
		const getHomePosts = async () => {
			try {
				sliceDispatch(setIsLoadingPosts(true));

				const res = await fetch(
					`${serverURL}/post/get-home-posts?userId=${
						user._id
					}&postIds=${JSON.stringify([])}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					sliceDispatch(setIsLoadingPosts(false));

					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnedPosts } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setPosts(returnedPosts));

					if (returnedPosts.length < 10) {
						sliceDispatch(setHasPosts(false));
					} else {
						sliceDispatch(setHasPosts(true));
					}
				} else if (msg === "No post") {
					sliceDispatch(setHasPosts(false));
				} else if (msg === "Fail to retrieve posts") {
					enqueueSnackbar("Fail to retrieve posts", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				sliceDispatch(setIsLoadingPosts(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				sliceDispatch(setIsLoadingPosts(false));
			}
		};

		getHomePosts();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	return (
		<div>
			{isLoadingPosts ? (
				<Loader />
			) : (
				<div className="bg-gray-200 w-full py-1 px-3">
					{hasPosts || posts.length > 0 ? (
						posts.map((post) => <Post key={post._id} post={post} />)
					) : (
						<h2 className="text-center my-2">No post</h2>
					)}
				</div>
			)}
		</div>
	);
};

export default Posts;
