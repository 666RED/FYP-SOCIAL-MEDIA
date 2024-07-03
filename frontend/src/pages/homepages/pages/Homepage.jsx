import { React, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { GiHamburgerMenu } from "react-icons/gi/index.js";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { GoBellFill } from "react-icons/go";
import NotificationContainer from "../../../components/notification/NotificationContainer.jsx";
import SideBar from "../../../components/Sidebar/SideBar.jsx";
import Error from "../../../components/Error.jsx";
import LoadMoreButton from "../../../components/LoadMoreButton.jsx";
import Posts from "../components/Posts.jsx";
import ChatsContainer from "../components/ChatsContainer.jsx";
import Loader from "../../../components/Spinner/Loader.jsx";
import {
	resetState,
	setHasPosts,
	loadPosts,
} from "../../../features/homeSlice.js";
import { NotificationContext } from "../../../App.js";
import { MessageContext } from "../../../App.js";
import { ServerContext } from "../../../App.js";

const Homepage = () => {
	const { notisLength } = useContext(NotificationContext);
	const { chats } = useContext(MessageContext);
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
	const [showChats, setShowChats] = useState(false);

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

	const handleShow = (item) => {
		if (item === "Chats") {
			if (showChats) {
				setShowChats(false);
			} else {
				setShowChats(true);
			}
			setShowNotifications(false);
		} else {
			if (showNotifications) {
				setShowNotifications(false);
			} else {
				setShowNotifications(true);
			}
			setShowChats(false);
		}
	};

	return user && token ? (
		<div className="flex flex-col">
			{/* SIDEBAR */}
			<SideBar
				selectedSection="Home"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
			{/* HEADER */}
			<div className="header-design flex items-center justify-between relative">
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
					{/* CHAT ICON */}
					<div className="relative">
						<IoChatbubbleEllipses
							className="icon relative"
							onClick={() => handleShow("Chats")}
							id="chat-icon"
						/>
						{showChats && (
							<div className="absolute left-0 right-0 bottom-[-4px] h-[2px] bg-blue-600"></div>
						)}

						<p
							className="absolute bg-red-600 rounded-full text-white px-1 text-xs -right-1 -top-1 cursor-pointer"
							onClick={() => handleShow("Chats")}
						>
							{chats.filter(
								(chat) =>
									!chat.viewed && chat.sender.toString() !== user._id.toString()
							).length !== 0 &&
								chats.filter(
									(chat) =>
										!chat.viewed &&
										chat.sender.toString() !== user._id.toString()
								).length}
						</p>
					</div>
					{/* NOTIFICATION ICON*/}
					<div className="relative mx-3">
						<GoBellFill
							className="icon"
							onClick={() => handleShow("Notifications")}
							id="notification-icon"
						/>
						{showNotifications && (
							<div className="absolute left-0 right-0 bottom-[-4px] h-[2px] bg-blue-600"></div>
						)}
						<p
							className="absolute bg-red-600 rounded-full text-white px-1 text-xs -right-2 -top-1 cursor-pointer"
							onClick={() => handleShow("Notifications")}
						>
							{notisLength !== 0 && notisLength}
						</p>
					</div>
				</div>
				{/* CHATS CONTAINER */}
				<ChatsContainer showChats={showChats} setShowChats={setShowChats} />
				{/* NOTIFICATION CONTAINER */}
				<NotificationContainer
					showNotifications={showNotifications}
					setShowNotifications={setShowNotifications}
				/>
			</div>
			{/* ADD NEW POST CONTAINER */}
			{/* later add */}
			{/* MAIN CONTENT */}
			<div className="main-content-design flex-1">
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
