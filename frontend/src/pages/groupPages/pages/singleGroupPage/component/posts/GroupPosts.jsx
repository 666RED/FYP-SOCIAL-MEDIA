import { React, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "../../../../../../components/Spinner/Loader.jsx";
import GroupPost from "./GroupPost.jsx";
import {
	setGroupPosts,
	resetGroupPostState,
	setHasPost,
	setIsLoadingPost,
	updatePost,
} from "../../../../../../features/groupPostSlice.js";
import { ServerContext } from "../../../../../../App.js";

const GroupPosts = ({ currentTime }) => {
	const { enqueueSnackbar } = useSnackbar();
	const { groupId } = useParams();
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { groupPosts, hasPost, isLoadingPost } = useSelector(
		(store) => store.groupPost
	);

	// get group posts
	useEffect(() => {
		const fetchGroupPosts = async () => {
			try {
				sliceDispatch(setIsLoadingPost(true));
				const res = await fetch(
					`${serverURL}/group-post/get-group-posts?groupId=${groupId}&currentTime=${currentTime}`,
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

				const { msg, returnGroupPosts } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setGroupPosts(returnGroupPosts));

					if (returnGroupPosts.length < 10) {
						sliceDispatch(setHasPost(false));
					} else {
						sliceDispatch(setHasPost(true));
					}
				} else if (msg === "No post") {
					sliceDispatch(setHasPost(false));
				} else if (msg === "Fail to retrieve group posts") {
					enqueueSnackbar("Fail to retrieve group posts", {
						variant: "error",
					});
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

		fetchGroupPosts();
	}, []);

	// reset group post state
	useEffect(() => {
		return () => {
			resetGroupPostState();
		};
	}, []);

	return (
		<div>
			{isLoadingPost ? (
				<Loader />
			) : (
				<div>
					{groupPosts.length > 0 ? (
						groupPosts.map((post) => <GroupPost key={post._id} post={post} />)
					) : (
						<h2 className="text-center my-2">No post</h2>
					)}
				</div>
			)}
		</div>
	);
};

export default GroupPosts;