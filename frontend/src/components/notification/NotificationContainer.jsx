import { React, useContext, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Notification from "./Notification.jsx";
import Loader from "../Spinner/Loader.jsx";
import { NotificationContext } from "../../App.js";
import { ServerContext } from "../../App.js";

const NotificationContainer = ({ showNotifications, setShowNotifications }) => {
	const serverURL = useContext(ServerContext);
	const notifications = useContext(NotificationContext);
	const [notis, setNotis] = useState([]);
	const [loading, setLoading] = useState(false);
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const containerRef = useRef();

	useEffect(() => {
		const getNotifications = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/notification/get-notifications-profile?notifications=${JSON.stringify(
						{
							notifications: notifications.map((notification) => {
								if (
									notification.action === "Accept join group" ||
									notification.action === "Add note"
								) {
									return {
										id: notification.id,
										acceptGroupId: notification.acceptGroupId,
										type: "Group",
									};
								} else if (
									notification.action === "Dismiss report" ||
									notification.action === "Mark resolved" ||
									notification.action === "Remove post to target" ||
									notification.action === "Remove post to reporter"
								) {
									return {
										id: notification.id,
										sender: notification.sender,
										type: "Admin",
									};
								} else {
									return {
										id: notification.id,
										sender: notification.sender,
										type: "User",
									};
								}
							}),
						}
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
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnedNotifications } = await res.json();

				if (msg === "Success") {
					setNotis(
						returnedNotifications.map((noti) => {
							const matchedNotification = notifications.find(
								(notification) => notification.id === noti.id
							);
							if (matchedNotification) {
								return {
									...matchedNotification,
									imagePath: noti.imagePath,
									type: noti.type,
								};
							}
							return matchedNotification;
						})
					);
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};

		getNotifications();
	}, [notifications]);

	// close container
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target) &&
				!(
					document.getElementById("notification-icon") &&
					document.getElementById("notification-icon").contains(event.target)
				)
			) {
				setShowNotifications(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className={`absolute -right-3 bg-white top-10 shadow-[rgba(0,0,0,0.1)_0px_0px_7px_7px] rounded-xl sm:min-w-[30rem] min-w-[18rem] min-h-[6rem] max-h-[35rem] overflow-x-hidden overflow-y-auto messages ${
				showNotifications ? "visible" : "hidden"
			}`}
			ref={containerRef}
		>
			{/* TITLE */}
			<h2 className="font-semibold indent-2 py-1 sticky top-0 bg-white z-40">
				Notifications
			</h2>
			{/* NOTIFICATIONS */}
			{loading ? (
				<Loader />
			) : notis.length > 0 ? (
				notis.map((noti, index) => (
					<Notification notification={noti} key={index} />
				))
			) : (
				<h2 className="text-center">No notification...</h2>
			)}
		</div>
	);
};

export default NotificationContainer;
