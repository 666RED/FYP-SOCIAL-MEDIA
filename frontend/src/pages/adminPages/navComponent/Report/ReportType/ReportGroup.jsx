import { React, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import GroupPosts from "../../../../groupPages/pages/singleGroupPage/component/posts/GroupPosts.jsx";
import LoadMoreButton from "../../../../../components/LoadMoreButton.jsx";
import { ServerContext } from "../../../../../App.js";
import {
	loadPost,
	setHasPost,
} from "../../../../../features/groupPostSlice.js";

const ReportGroup = ({ target }) => {
	const sliceDispatch = useDispatch();
	const { token } = useSelector((store) => store.admin);
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const [viewPosts, setViewPosts] = useState(false);
	const { hasPost, isLoadingPosts } = useSelector((store) => store.groupPost);
	const [loadMore, setLoadMore] = useState(false);
	const [count, setCount] = useState(10);

	const currentTime = new Date();
	currentTime.setSeconds(currentTime.getSeconds() + 1);
	const updatedTime = currentTime.toUTCString();

	const handleLoadMore = async (e) => {
		e.preventDefault();
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/group-post/get-group-posts?groupId=${target._id}&count=${count}&currentTime=${updatedTime}`,
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

	return (
		<div>
			{/* COVER IMAGE */}
			<img
				src={target.groupCoverImagePath}
				alt="Cover image"
				className="rounded-xl mx-auto w-10/12"
			/>
			{/* GROUP IMAGE & GROUP INFO*/}
			<div className="grid grid-cols-12 gap-x-4 w-8/12 mx-auto my-3 items-center">
				{/* LEFT PART */}
				<div className="col-span-4 md:col-span-3 flex flex-col items-center">
					<img
						src={target.groupImagePath}
						alt="Profile image"
						className="w-full rounded-full border border-black"
					/>
				</div>
				{/* RIGHT PART */}
				<div className="col-span-8 md:col-span-9">
					<p className="font-semibold">{target.groupName}</p>
					<p>{Object.keys(target.members).length} members</p>
					<p>{target.groupBio}</p>
				</div>
			</div>
			{/* VIEW POSTS */}
			{!viewPosts && (
				<button
					className="btn-gray mx-auto block mt-4"
					onClick={() => setViewPosts(true)}
				>
					VIEW POSTS
				</button>
			)}
			{/* POSTS */}
			{viewPosts && (
				<div className="bg-gray-200 py-2">
					<GroupPosts
						currentTime={updatedTime}
						groupId={target._id}
						isAdmin={true}
					/>
					{/* LOAD MORE BUTTON */}
					<LoadMoreButton
						handleLoadMore={handleLoadMore}
						hasComponent={hasPost}
						isLoadingComponent={isLoadingPosts}
						loadMore={loadMore}
					/>
				</div>
			)}
		</div>
	);
};

export default ReportGroup;
