import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserPost from "./UserPost.jsx";
import Loader from "../../../../components/Spinner/Loader.jsx";
import { ServerContext } from "../../../../App.js";
import { enqueueSnackbar } from "notistack";
import {
	setPost,
	resetState,
	setHasPost,
	setIsLoadingPost,
} from "../../features/userPosts/userPostSlice.js";

const UserPosts = () => {
	const { userId } = useParams();
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { posts, hasPost, isLoadingPost } = useSelector((store) => store.post);

	useEffect(() => {
		const getPost = async () => {
			try {
				sliceDispatch(setIsLoadingPost(true));

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
					sliceDispatch(setIsLoadingPost(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, posts } = await res.json();

				if (msg === "No post") {
					sliceDispatch(setHasPost(false));
				} else if (msg === "Fail to retrieve posts") {
					enqueueSnackbar("Fail to retrieve posts", {
						variant: "error",
					});
				} else if (msg === "Success") {
					sliceDispatch(setPost(posts));
					sliceDispatch(setHasPost(true));

					if (posts.length < 10) {
						sliceDispatch(setHasPost(false));
					} else {
						sliceDispatch(setHasPost(true));
					}
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				sliceDispatch(setIsLoadingPost(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				sliceDispatch(setIsLoadingPost(false));
			}
		};
		getPost();

		return () => {
			sliceDispatch(resetState());
		};
	}, [userId]);

	return (
		<div>
			{isLoadingPost ? (
				<Loader />
			) : (
				<div className="bg-gray-200 w-full py-1 px-3">
					{hasPost || posts.length > 0 ? (
						posts.map((post) => <UserPost key={post._id} post={post} />)
					) : (
						<h2 className="text-center my-2">No post</h2>
					)}
				</div>
			)}
		</div>
	);
};

export default UserPosts;
