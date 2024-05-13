import { React, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import UserProfile from "./components/userProfile/UserProfile.jsx";
import UserPosts from "./components/userPost/UserPosts.jsx";
import AddNewPostForm from "./components/userProfile/AddNewPostForm.jsx";
import BackArrowHeader from "../../components/BackArrow/BackArrowHeader.jsx";
import SideBar from "../../components/Sidebar/SideBar.jsx";
import Header from "../../components/Header.jsx";
import Error from "../../components/Error.jsx";
import LoadMoreButton from "../../components/LoadMoreButton.jsx";
import {
	resetState,
	loadPost,
	setHasPost,
} from "./features/userPosts/userPostSlice.js";
import { resetCommentArray } from "./features/comment/commentSlice.js";
import { ServerContext } from "../../App.js";

const UserProfilePage = () => {
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { userId } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const { user, token } = useSelector((store) => store.auth);
	const { hasPost, isLoadingPost, showAddNewPostForm } = useSelector(
		(store) => store.post
	);

	const [extendSideBar, setExtendSideBar] = useState(false);
	const [loadMore, setLoadMore] = useState(false);
	const [count, setCount] = useState(10);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
			sliceDispatch(resetCommentArray());
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			let currentUserId;
			if (userId === user._id) {
				currentUserId = user._id;
			} else {
				currentUserId = userId;
			}

			const res = await fetch(
				`${serverURL}/post/get-posts?userId=${currentUserId}&count=${count}`,
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

			const { msg, posts } = await res.json();

			if (msg === "Success") {
				sliceDispatch(loadPost(posts));
				setCount((prevCount) => prevCount + 10);

				if (posts.length < 10) {
					sliceDispatch(setHasPost(false));
				} else {
					sliceDispatch(setHasPost(true));
				}
			} else if (msg === "Fail to retrieve posts") {
				enqueueSnackbar("Fail to retrieve posts", { variant: "error" });
			} else if (msg === "No post") {
				sliceDispatch(setHasPost(false));
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	return user && token ? (
		<div className={`${userId === user._id && "py-2"}`}>
			{/* ADD NEW POST FORM */}
			{showAddNewPostForm && <AddNewPostForm />}
			{/* SIDEBAR */}
			<SideBar
				selectedSection="Profile"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
			{/* HEADER */}
			{userId === user._id ? (
				<Header
					extendSideBar={extendSideBar}
					setExtendSideBar={setExtendSideBar}
					title="Profile"
				/>
			) : (
				<div className="px-3 py-1 bg-white">
					<BackArrowHeader title="User Profile" />
				</div>
			)}
			<div className="page-design">
				{/* USER PROFILE */}
				<UserProfile />
				<hr className="border-4 border-gray-400 my-4" />
				{/* USER POSTS */}
				<UserPosts />
				{/* LOAD MORE BUTTON */}
				<LoadMoreButton
					handleLoadMore={handleLoadMore}
					hasComponent={hasPost}
					isLoadingComponent={isLoadingPost}
					loadMore={loadMore}
				/>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default UserProfilePage;
