import { React, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UserPosts from "./components/UserPosts.jsx";
import AddNewPostForm from "./components/AddNewPostForm.jsx";
import BackArrowHeader from "../../components/BackArrow/BackArrowHeader.jsx";
import SideBar from "../../components/Sidebar/SideBar.jsx";
import Header from "../../components/Header.jsx";
import Error from "../../components/Error.jsx";
import LoadMoreButton from "../../components/LoadMoreButton.jsx";
import {
	resetState,
	loadPosts,
	setHasPosts,
} from "../../features/postSlice.js";
import { resetCommentArray } from "../../components/comment/feature/commentSlice.js";
import { ServerContext } from "../../App.js";

const UserProfilePage = () => {
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { userId } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const { user, token } = useSelector((store) => store.auth);
	const { hasPosts, isLoadingPosts, showAddNewPostForm } = useSelector(
		(store) => store.post
	);

	const [extendSideBar, setExtendSideBar] = useState(false);
	const [loadMore, setLoadMore] = useState(false);
	const [count, setCount] = useState(10);
	const [isFriend, setIsFriend] = useState(false);
	const [loading, setLoading] = useState(false);

	// get friend status (if other person view your profile)
	useEffect(() => {
		const getIsFriend = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/friend/get-is-friend?userId=${user._id}&friendId=${userId}`,
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

				const { msg } = await res.json();

				if (msg === "Friend") {
					setIsFriend(true);
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else if (msg === "Not friend") {
					setIsFriend(false);
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

		if (user._id !== userId) {
			getIsFriend();
		}
	}, []);

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
				sliceDispatch(loadPosts(posts));
				setCount((prevCount) => prevCount + 10);

				if (posts.length < 10) {
					sliceDispatch(setHasPosts(false));
				} else {
					sliceDispatch(setHasPosts(true));
				}
			} else if (msg === "Fail to retrieve posts") {
				enqueueSnackbar("Fail to retrieve posts", { variant: "error" });
			} else if (msg === "No post") {
				sliceDispatch(setHasPosts(false));
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
		<div>
			{loading && <Spinner />}
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
				<BackArrowHeader title="User Profile" />
			)}
			<div className="main-content-design">
				{/* USER PROFILE */}
				<UserProfile isFriend={isFriend} />
				<hr className="border-4 border-gray-400 my-4" />
				{isFriend || user._id === userId ? (
					<div>
						{/* USER POSTS */}
						<UserPosts />
						{/* LOAD MORE BUTTON */}
						<LoadMoreButton
							handleLoadMore={handleLoadMore}
							hasComponent={hasPosts}
							isLoadingComponent={isLoadingPosts}
							loadMore={loadMore}
						/>
					</div>
				) : (
					<h2 className="text-center mb-2">Add friend to view posts</h2>
				)}
			</div>
		</div>
	) : (
		<Error />
	);
};

export default UserProfilePage;
