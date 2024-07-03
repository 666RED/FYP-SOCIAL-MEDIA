import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Error from "../../../../../../components/Error.jsx";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import GroupPosts from "./GroupPosts.jsx";
import LoadMoreButton from "../../../../../../components/LoadMoreButton.jsx";
import {
	resetGroupPostState,
	loadPost,
	setHasPost,
} from "../../../../../../features/groupPostSlice.js";
import { ServerContext } from "../../../../../../App.js";

const ViewYourPostsPage = () => {
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { groupId } = useParams();
	const { user, token } = useSelector((store) => store.auth);
	const [loadMore, setLoadMore] = useState(false);
	const { hasPost, isLoadingPosts } = useSelector((store) => store.groupPost);
	const [count, setCount] = useState(10);

	const currentTime = new Date();
	currentTime.setSeconds(currentTime.getSeconds() + 1);
	const updatedTime = currentTime.toUTCString();

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetGroupPostState());
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/group-post/get-your-group-posts?groupId=${groupId}&count=${count}&currentTime=${updatedTime}&userId=${user._id}`,
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

			const { msg, returnGroupPosts } = await res.json();

			if (msg === "Success") {
				sliceDispatch(loadPost(returnGroupPosts));
				setCount((prev) => prev + 10);

				if (returnGroupPosts.length < 10) {
					sliceDispatch(setHasPost(false));
				} else {
					sliceDispatch(setHasPost(true));
				}
			} else if (msg === "Fail to retrieve group posts") {
				enqueueSnackbar("Fail to retrieve group posts", { variant: "error" });
			} else if (msg === "No post") {
				sliceDispatch(setHasPost(false));
			}

			setLoadMore(false);
		} catch (err) {
			setLoadMore(false);
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return user && token ? (
		<div className="flex flex-col h-full">
			{/* HEADER */}
			<div className="p-2">
				<DirectBackArrowHeader
					destination={`/group/${groupId}`}
					title="Your posts"
				/>
			</div>
			<div className="main-content-design flex-1">
				{/* YOUR POSTS */}
				<GroupPosts
					currentTime={currentTime}
					groupId={groupId}
					getYourPost={true}
				/>
				{/* LOAD MORE BUTTON */}
				<LoadMoreButton
					handleLoadMore={handleLoadMore}
					hasComponent={hasPost}
					isLoadingComponent={isLoadingPosts}
					loadMore={loadMore}
				/>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default ViewYourPostsPage;
