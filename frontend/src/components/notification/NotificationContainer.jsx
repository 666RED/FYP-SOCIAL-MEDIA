import { React, useContext } from "react";
import Notification from "./Notification.jsx";
// import { NotificationContext } from "../../App.js";
import { MdCancel } from "react-icons/md";

const NotificationContainer = ({
	showNotifications,
	toggleShowNotification,
}) => {
	// const notifications = useContext(NotificationContext);

	return (
		<div className={`notifications ${showNotifications ? "show" : ""}`}>
			{/* CANCEL ICON */}
			<div className="ml-2 mt-2 flex items-center sticky top-0 bg-white">
				<MdCancel
					onClick={toggleShowNotification}
					className="text-2xl cursor-pointer text-red-600 hover:opacity-70 mr-2"
				/>
				{/* TITLE */}
				<h2>Notifications</h2>
			</div>
			{/* NOTIFICATIONS */}
			{/* {notifications.map((notification) => (
				<Notification notification={notification} key={notification.id} />
			))} */}
		</div>
	);
};

export default NotificationContainer;
