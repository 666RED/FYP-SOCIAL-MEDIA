import { React, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { GiHamburgerMenu } from "react-icons/gi/index.js";
import { GoBellFill } from "react-icons/go";
import NotificationContainer from "../../../components/notification/NotificationContainer.jsx";
import { ServerContext } from "../../../App.js";
import SideBar from "../../../components/Sidebar/SideBar.jsx";
import Error from "../../../components/Error.jsx";
import LoadMoreButton from "../../../components/LoadMoreButton.jsx";
import Posts from "../components/Posts.jsx";
import {
	resetState,
	setHasPosts,
	loadPosts,
} from "../../../features/homeSlice.js";
import { NotificationContext } from "../../../App.js";

const Homepage = () => {
	const notifications = useContext(NotificationContext);
	const serverURL = useContext(ServerContext);
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [loadMore, setLoadMore] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { hasPosts, isLoadingPosts, posts } = useSelector(
		(store) => store.home
	);
	const [showNotifications, setShowNotifications] = useState(false);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/post/get-home-posts?userId=${
					user._id
				}&posts=${JSON.stringify(
					posts.map((post) => ({ id: post._id, type: post.type }))
				)}`,
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

			const { msg, returnedPosts } = await res.json();

			if (msg === "Success") {
				sliceDispatch(loadPosts(returnedPosts));

				if (returnedPosts.length < 15) {
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

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	const toggleShowNotification = () => {
		setShowNotifications((prev) => !prev);
	};

	return user && token ? (
		<div className="py-2" id="example">
			{/* NOTIFICATION CONTAINER */}
			<NotificationContainer
				showNotifications={showNotifications}
				toggleShowNotification={toggleShowNotification}
			/>
			{/* SIDEBAR */}
			<SideBar
				selectedSection="Home"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
			{/* HEADER */}
			<div className="mb-2 px-2 sticky top-0 bg-white z-20 flex items-center justify-between">
				{/* LEFT HAND SIDE */}
				<div className="flex items-center">
					{/* BURGER ICON */}
					<GiHamburgerMenu
						onClick={() => setExtendSideBar(!extendSideBar)}
						className="mr-3 icon"
					/>
					{/* TITLE */}
					<h2>Home</h2>
				</div>
				{/* RIGHT HAND SIDE */}
				<div className="flex items-center">
					{/* NOTIFICATION ICON*/}
					<div className="relative">
						<GoBellFill
							className="icon mr-3"
							onClick={toggleShowNotification}
						/>
						<p className="absolute bg-red-600 rounded-full text-white px-1 text-xs right-1 -top-1">
							{notifications.filter((noti) => !noti.viewed).length !== 0 &&
								notifications.filter((noti) => !noti.viewed).length}
						</p>
					</div>
				</div>
			</div>
			{/* ADD NEW POST CONTAINER */}
			{/* MAIN CONTENT */}
			<div className="page-design overflow-hidden">
				{/* POSTS */}
				<Posts />
				{/* LOAD MORE BUTTON */}
				<LoadMoreButton
					handleLoadMore={handleLoadMore}
					hasComponent={hasPosts}
					isLoadingComponent={isLoadingPosts}
					loadMore={loadMore}
				/>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default Homepage;
