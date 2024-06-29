import { React, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdCancel } from "react-icons/md";
import Notification from "./Notification.jsx";
import Loader from "../Spinner/Loader.jsx";
import { NotificationContext } from "../../App.js";
import { ServerContext } from "../../App.js";

const NotificationContainer = ({
	showNotifications,
	toggleShowNotification,
}) => {
	const serverURL = useContext(ServerContext);
	const notifications = useContext(NotificationContext);
	const [notis, setNotis] = useState([]);
	const [loading, setLoading] = useState(false);
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();

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

	return (
		<div className="absolute right-0 bg-white top-10 shadow-2xl rounded-xl min-w-[30rem] min-h-[7rem] overflow-hidden">
			<div className="ml-2 mt-2 flex items-center sticky top-0 bg-white z-40">
				{/* TITLE */}
				<h2 className="font-semibold">Notifications</h2>
			</div>
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
