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
							notifications,
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
					setNotis(returnedNotifications);
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
		<div className={`notifications ${showNotifications ? "show" : ""}`}>
			{/* CANCEL ICON */}
			<div className="ml-2 mt-2 flex items-center sticky top-0 bg-white z-40">
				<MdCancel
					onClick={toggleShowNotification}
					className="text-2xl cursor-pointer text-red-600 hover:opacity-70 mr-2"
				/>
				{/* TITLE */}
				<h2>Notifications</h2>
			</div>
			{/* NOTIFICATIONS */}
			{loading ? (
				<Loader />
			) : notis.length > 0 ? (
				notis.map((noti, index) => (
					<Notification notification={noti} key={index} />
				))
			) : (
				<h2>No notification</h2>
			)}
		</div>
	);
};

export default NotificationContainer;
