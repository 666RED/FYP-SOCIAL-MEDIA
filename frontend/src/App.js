import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

import Login from "./pages/loginPages/Login.jsx";
import Homepage from "./pages/homepages/pages/Homepage.jsx";
import RecoverPassword from "./pages/recoverPasswordPages/RecoverPassword.jsx";
import AuthVerificationCode from "./pages/recoverPasswordPages/AuthVerificationCode.jsx";
import ResetPassword from "./pages/recoverPasswordPages/ResetPassword.jsx";
import UserProfilePage from "./pages/profilePages/UserProfilePage.jsx";
import EditProfile from "./pages/profilePages/EditProfile.jsx";
import ViewFriends from "./pages/profilePages/ViewFriendsPage.jsx";
import CampusCondition from "./pages/campusConditionPages/pages/mainPage/CampusConditionPage.jsx";
import UploadCondition from "./pages/campusConditionPages/pages/uploadPage/UploadCondition.jsx";
import ViewMostUsefulCondition from "./pages/campusConditionPages/pages/viewMostUsefulConditionPage/ViewMostUsefulCondition.jsx";
import FriendPage from "./pages/friendPages/pages/mainPages/FriendPage.jsx";
import FriendRequestPage from "./pages/friendPages/pages/friendRequestPages/FriendRequestPage.jsx";
import ExploreFriendPage from "./pages/friendPages/pages/exploreFriendPages/ExploreFriendPage.jsx";
import PendingPage from "./pages/friendPages/pages/pendingPage/PendingPage.jsx";
import GroupPage from "./pages/groupPages/pages/mainPage/GroupPage.jsx";
import CreateNewGroupPage from "./pages/groupPages/pages/createNewGroupPage/CreateNewGroupPage.jsx";
import SingleGroupPage from "./pages/groupPages/pages/singleGroupPage/SingleGroupPage.jsx";
import EditGroupPage from "./pages/groupPages/pages/editGroupPage/EditGroupPage.jsx";
import JoinRequestPage from "./pages/groupPages/pages/joinRequestPage/JoinRequestPage.jsx";
import ViewMembersPage from "./pages/groupPages/pages/viewMembersPage/ViewMembersPage.jsx";
import MarketplaceMainPage from "./pages/marketplacePages/pages/mainPages/MainPage.jsx";
import CreateNewItem from "./pages/marketplacePages/pages/addNewPages/CreateNewItem.jsx";
import ViewProduct from "./pages/marketplacePages/pages/mainPages/components/product/ViewProduct.jsx";
import EditProduct from "./pages/marketplacePages/pages/mainPages/components/product/EditProduct.jsx";
import ViewService from "./pages/marketplacePages/pages/mainPages/components/service/ViewService.jsx";
import EditService from "./pages/marketplacePages/pages/mainPages/components/service/EditService.jsx";
import ViewEvent from "./pages/marketplacePages/pages/mainPages/components/event/ViewEvent.jsx";
import EditEvent from "./pages/marketplacePages/pages/mainPages/components/event/EditEvent.jsx";
import SettingMainPage from "./pages/settingPages/mainPages/SettingMainPage.jsx";
import AdminLoginPage from "./pages/adminPages/loginPages/LoginPage.jsx";
import DashboardPage from "./pages/adminPages/navComponent/Dashboard/DashboardPage.jsx";
import UserPage from "./pages/adminPages/navComponent/User/UserPage.jsx";
import AdminGroupPage from "./pages/adminPages/navComponent/Group/GroupPage.jsx";
import ConditionPage from "./pages/adminPages/navComponent/Condition/ConditionPage.jsx";
import ProductPage from "./pages/adminPages/navComponent/Product/ProductPage.jsx";
import ServicePage from "./pages/adminPages/navComponent/Service/ServicePage.jsx";
import EventPage from "./pages/adminPages/navComponent/Event/EventPage.jsx";
import ReportPage from "./pages/adminPages/navComponent/Report/ReportPage.jsx";
import FolderPage from "./pages/groupPages/pages/singleGroupPage/component/notes/FolderPage.jsx";
import NotePage from "./pages/groupPages/pages/singleGroupPage/component/notes/pages/NotePage.jsx";
import ViewYourPostsPage from "./pages/groupPages/pages/singleGroupPage/component/posts/ViewYourPostsPage.jsx";
import YourConditionsPage from "./pages/campusConditionPages/pages/yourConditionsPage/YourConditionsPage.jsx";
import ContactPage from "./pages/adminPages/loginPages/ContactPage.jsx";
import ViewPost from "./components/notification/ViewPost.jsx";
import ViewCondition from "./components/notification/ViewCondition.jsx";
import ViewGroupPost from "./components/notification/ViewGroupPost.jsx";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar, closeSnackbar } from "notistack";
import { MdCancel } from "react-icons/md";
import { db } from "./firebase-config.js";
import {
	query,
	where,
	onSnapshot,
	collection,
	getDocs,
	orderBy,
} from "firebase/firestore";
import ChatPage from "./components/chat/ChatPage.jsx";

export const ServerContext = createContext();
export const NotificationContext = createContext([]);
export const MessageContext = createContext([]);

function App() {
	// const server = "https://fyp-fsktm-connect.onrender.com";
	const server = "http://localhost:3001";

	const { user } = useSelector((store) => store.auth);
	const [notifications, setNotifications] = useState([]);
	const [messages, setMessages] = useState([]);
	const { enqueueSnackbar } = useSnackbar();

	const snackBarSetting = {
		autoHideDuration: null,
		variant: "custom-snackbar",
		action: (key) => (
			<button onClick={() => closeSnackbar(key)}>
				<MdCancel className="text-xl" />
			</button>
		),
	};

	// for each time a new notification is added
	useEffect(() => {
		if (!user) {
			return () => {};
		}

		const notificationRef = collection(db, "notifications");
		const queryMessages = query(
			notificationRef,
			where("receiver", "==", user._id.toString()),
			orderBy("createdAt", "desc")
		);

		let first = true;

		const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const data = change.doc.data();
				const { id } = change.doc;
				if (!first) {
					if (change.type === "added") {
						switch (data.action) {
							case "Like post": {
								enqueueSnackbar(
									`${data.userName} liked your post`,
									snackBarSetting
								);
								break;
							}
							case "Comment post": {
								enqueueSnackbar(
									`${data.userName} commented on your post`,
									snackBarSetting
								);
								break;
							}
							case "Rate up": {
								enqueueSnackbar(
									`${data.userName} rated up on your campus condition`,
									snackBarSetting
								);
								break;
							}
							case "Rate down": {
								enqueueSnackbar(
									`${data.userName} rated down on your campus condition`,
									snackBarSetting
								);
								break;
							}
							case "Mark resolved": {
								enqueueSnackbar(
									`${data.userName} marked resolved on your campus condition`,
									snackBarSetting
								);
								break;
							}
							case "Add friend": {
								enqueueSnackbar(
									`${data.userName} sent you a friend request`,
									snackBarSetting
								);
								break;
							}
							case "Accept friend request": {
								enqueueSnackbar(
									`${data.userName} accepted your friend request`,
									snackBarSetting
								);
								break;
							}
							case "Join group": {
								enqueueSnackbar(
									`${data.userName} sent a join group request`,
									snackBarSetting
								);
								break;
							}
							case "Accept join group": {
								enqueueSnackbar(
									`${data.groupName}'s group admin accepted your join group request`,
									snackBarSetting
								);
								break;
							}
							case "Like group post": {
								enqueueSnackbar(
									`${data.userName} liked your group post`,
									snackBarSetting
								);
								break;
							}
							case "Comment group post": {
								enqueueSnackbar(
									`${data.userName} commented on your group post`,
									snackBarSetting
								);
								break;
							}
							case "Add note": {
								enqueueSnackbar(
									`New note added in ${data.groupName}`,
									snackBarSetting
								);
								break;
							}
						}
						setNotifications((prevNotifications) => [
							{ id, ...data },
							...prevNotifications,
						]);
					} else if (change.type === "modified") {
						setNotifications((prevNotifications) =>
							prevNotifications.map((noti) =>
								noti.id === id ? { id, ...data } : noti
							)
						);
					} else if (change.type === "removed") {
						setNotifications((prevNotifications) =>
							prevNotifications.filter((noti) => noti.id !== id)
						);
					}
				}
			});

			first = false;
		});

		return () => unsubscribe();
	}, [user]);

	// for each time a new message is added
	useEffect(() => {
		if (!user) {
			return () => {};
		}

		const messageRef = collection(db, "messages");

		const queryMessage = query(
			messageRef,
			where("receiver", "==", user._id.toString()),
			orderBy("createdAt", "desc")
		);

		let first = true;

		const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
			const newMessages = [];
			snapshot.forEach((doc) => {
				newMessages.push({ id: doc.id, ...doc.data() });
			});
			if (!first) {
				newMessages.forEach((newMessage) => {
					const existingMessageIndex = messages.findIndex(
						(message) => message.id === newMessage.id
					);

					if (existingMessageIndex !== -1) {
						// Check if the viewed status has changed
						const existingMessage = messages[existingMessageIndex];
						if (existingMessage.viewed !== newMessage.viewed) {
							// Update the message in the state
							setMessages((prevMessages) =>
								prevMessages.map((message, index) =>
									index === existingMessageIndex ? newMessage : message
								)
							);
						}
					} else {
						// ADD NEW message
						setMessages((prevMessages) => [newMessage, ...prevMessages]);
					}
				});
			}

			first = false;
		});

		const handleNewMessages = (newMessages) => {
			setMessages((prevMessages) => {
				const combinedMessages = [...prevMessages, ...newMessages];
				const sortedMessages = combinedMessages.sort((a, b) => {
					const timeA =
						a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000;
					const timeB =
						b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000;
					return timeB - timeA;
				});

				const unread = {};
				const filteredMessages = [];
				sortedMessages.forEach((message) => {
					if (
						message.sender.toString() === user._id.toString() &&
						!(message.receiver in unread)
					) {
						unread[message.receiver] = "1";
						filteredMessages.push(message);
					} else if (
						message.receiver.toString() === user._id.toString() &&
						!(message.sender in unread)
					) {
						unread[message.sender] = "1";
						filteredMessages.push(message);
					}
				});

				return filteredMessages;
			});
		};

		return () => unsubscribe();
	}, [user]);

	// first render
	useEffect(() => {
		if (!user) {
			return () => {};
		}
		getNotifications();
		getChats();
	}, [user]);

	const getNotifications = async () => {
		try {
			const notificationRef = collection(db, "notifications");
			const queryMessages = query(
				notificationRef,
				where("receiver", "==", user._id.toString()),
				orderBy("createdAt", "desc")
			);

			const data = await getDocs(queryMessages);
			const filteredData = data.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNotifications(filteredData);
		} catch (err) {
			console.log("Fail to retrieve notifications");
		}
	};

	const getChats = async () => {
		try {
			const messageRef = collection(db, "messages");

			const queryMessage1 = query(
				messageRef,
				where("receiver", "==", user._id.toString()),
				orderBy("createdAt", "desc")
			);
			const queryMessage2 = query(
				messageRef,
				where("sender", "==", user._id.toString()),
				orderBy("createdAt", "desc")
			);

			onSnapshot(queryMessage1, (snapshot) => {
				const newMessages1 = [];
				snapshot.forEach((doc) => {
					newMessages1.push({ id: doc.id, ...doc.data() });
				});

				handleNewMessages(newMessages1);
			});

			onSnapshot(queryMessage2, (snapshot) => {
				const newMessages2 = [];
				snapshot.forEach((doc) => {
					newMessages2.push({ id: doc.id, ...doc.data() });
				});

				handleNewMessages(newMessages2);
			});

			const handleNewMessages = (newMessages) => {
				setMessages((prevMessages) => {
					const combinedMessages = [...prevMessages, ...newMessages];
					const sortedMessages = combinedMessages.sort((a, b) => {
						const timeA =
							a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000;
						const timeB =
							b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000;
						return timeB - timeA;
					});

					const unread = {};
					const filteredMessages = [];
					sortedMessages.forEach((message) => {
						if (
							message.sender.toString() === user._id.toString() &&
							!(message.receiver in unread)
						) {
							unread[message.receiver] = "1";
							filteredMessages.push(message);
						} else if (
							message.receiver.toString() === user._id.toString() &&
							!(message.sender in unread)
						) {
							unread[message.sender] = "1";
							filteredMessages.push(message);
						}
					});

					return filteredMessages;
				});
			};
		} catch (err) {
			console.log("Fail to retrieve chats");
		}
	};

	return (
		<ServerContext.Provider value={server}>
			<NotificationContext.Provider value={notifications}>
				<MessageContext.Provider value={{ chats: messages }}>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Login />} />
							<Route path="/home" element={<Homepage />} />
							<Route path="/recover-password" element={<RecoverPassword />} />
							<Route
								path="/recover-password/auth/:userId"
								element={<AuthVerificationCode />}
							/>
							<Route
								path="/recover-password/reset-password/:userId"
								element={<ResetPassword />}
							/>
							<Route path="/profile/:userId" element={<UserProfilePage />} />
							<Route path="/profile/edit-profile" element={<EditProfile />} />
							<Route
								path="/profile/view-friends/:userId"
								element={<ViewFriends />}
							/>
							<Route path="/campus-condition" element={<CampusCondition />} />
							<Route
								path="/campus-condition/upload-condition"
								element={<UploadCondition />}
							/>
							<Route
								path="/campus-condition/your-conditions"
								element={<YourConditionsPage />}
							/>
							<Route
								path="/campus-condition/view-most-useful-condition/:conditionId"
								element={<ViewMostUsefulCondition />}
							/>
							<Route path="/friend" element={<FriendPage />} />
							<Route
								path="/friend/friend-request"
								element={<FriendRequestPage />}
							/>
							<Route
								path="/friend/explore-friend"
								element={<ExploreFriendPage />}
							/>
							<Route
								path="/friend/friend-request-pending"
								element={<PendingPage />}
							/>
							<Route path="/group" element={<GroupPage />} />
							<Route
								path="/group/create-new-group"
								element={<CreateNewGroupPage />}
							/>
							<Route path="/group/:groupId" element={<SingleGroupPage />} />
							<Route
								path="/group/edit-group/:groupId"
								element={<EditGroupPage />}
							/>
							<Route
								path="/group/join-request/:groupId"
								element={<JoinRequestPage />}
							/>
							<Route
								path="/group/view-members/:groupId/:groupAdminId"
								element={<ViewMembersPage />}
							/>
							<Route path="/marketplace" element={<MarketplaceMainPage />} />
							<Route
								path="/marketplace/create-new-item"
								element={<CreateNewItem />}
							/>
							<Route
								path="/marketplace/product/view-product/:id"
								element={<ViewProduct />}
							/>
							<Route
								path="/marketplace/product/edit-product/:id"
								element={<EditProduct />}
							/>
							<Route
								path="/marketplace/service/view-service/:id"
								element={<ViewService />}
							/>
							<Route
								path="/marketplace/service/edit-service/:id"
								element={<EditService />}
							/>
							<Route
								path="/marketplace/event/edit-event/:id"
								element={<EditEvent />}
							/>
							<Route
								path="/marketplace/event/view-event/:id"
								element={<ViewEvent />}
							/>
							<Route path="/setting/:earlyUser" element={<SettingMainPage />} />
							<Route path="/admin" element={<AdminLoginPage />} />
							<Route path="/admin/dashboard" element={<DashboardPage />} />
							<Route path="/admin/user" element={<UserPage />} />
							<Route path="/admin/group" element={<AdminGroupPage />} />
							<Route path="/admin/condition" element={<ConditionPage />} />
							<Route path="/admin/product" element={<ProductPage />} />
							<Route path="/admin/service" element={<ServicePage />} />
							<Route path="/admin/event" element={<EventPage />} />
							<Route path="/admin/report" element={<ReportPage />} />
							<Route
								path="/group/:groupId/view-notes"
								element={<FolderPage />}
							/>
							<Route
								path="/group/:groupId/view-notes/:folderId/:view"
								element={<NotePage />}
							/>
							<Route
								path="/group/:groupId/your-posts"
								element={<ViewYourPostsPage />}
							/>
							<Route path="/admin/contact" element={<ContactPage />} />
							<Route
								path="/notification/view-post/:postId/:report"
								element={<ViewPost />}
							/>
							<Route
								path="/notification/view-condition/:conditionId"
								element={<ViewCondition />}
							/>
							<Route
								path="/notification/view-group-post/:postId/"
								element={<ViewGroupPost />}
							/>
							<Route path="/chat/:friendId" element={<ChatPage />} />
						</Routes>
					</BrowserRouter>
				</MessageContext.Provider>
			</NotificationContext.Provider>
		</ServerContext.Provider>
	);
}

export default App;
