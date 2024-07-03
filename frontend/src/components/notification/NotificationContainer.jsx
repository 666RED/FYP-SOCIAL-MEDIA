import { React, useContext, useEffect, useState, useRef } from "react";
import Notification from "./Notification.jsx";
import Loader from "../Spinner/Loader.jsx";
import { NotificationContext } from "../../App.js";

const NotificationContainer = ({ showNotifications, setShowNotifications }) => {
	const { notifications, notisLength } = useContext(NotificationContext);
	const [notis, setNotis] = useState([]);
	const [loading, setLoading] = useState(false);
	const containerRef = useRef();

	// every time the notifiations updated
	useEffect(() => {
		if (notisLength !== 0) {
			if (notifications.length === 0) {
				setLoading(true);
			} else {
				setLoading(false);
			}
		}
		setNotis(notifications);
	}, [notifications, notisLength]);

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
			className={`right-container messages ${
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
