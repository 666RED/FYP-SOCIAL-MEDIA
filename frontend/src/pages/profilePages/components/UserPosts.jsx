import { React, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Post from "../../../components/post/Post.jsx";
import Loader from "../../../components/Spinner/Loader.jsx";
import {
	setPosts,
	resetState,
	setHasPosts,
	setIsLoadingPosts,
} from "../../../features/postSlice.js";
import { ServerContext } from "../../../App.js";

const UserPosts = () => {
	const { userId } = useParams();
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { posts, hasPosts, isLoadingPosts } = useSelector(
		(store) => store.post
	);

	// get posts
	useEffect(() => {
		const getPost = async () => {
			try {
				sliceDispatch(setIsLoadingPosts(true));

				// determine if it is user or visitor
				let currentUserId;
				if (userId === user._id) {
					currentUserId = user._id;
				} else {
					currentUserId = userId;
				}

				const res = await fetch(
					`${serverURL}/post/get-posts?userId=${currentUserId}`,
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

				const { msg, posts } = await res.json();

				if (msg === "No post") {
					sliceDispatch(setHasPosts(false));
				} else if (msg === "Fail to retrieve posts") {
					enqueueSnackbar("Fail to retrieve posts", {
						variant: "error",
					});
				} else if (msg === "Success") {
					sliceDispatch(setPosts(posts));

					if (posts.length < 10) {
						sliceDispatch(setHasPosts(false));
					} else {
						sliceDispatch(setHasPosts(true));
					}
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
		getPost();

		return () => {
			sliceDispatch(resetState());
		};
	}, [userId]);

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

export default UserPosts;
