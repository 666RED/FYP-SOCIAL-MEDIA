import React, { useEffect, useState, useContext } from "react";
import { ServerContext } from "../../App.js";
import { formatDateTime } from "../../usefulFunction.js";

const Notification = ({ notification }) => {
	const serverURL = useContext(ServerContext);
	const [action, setAction] = useState("");

	// determine action
	useEffect(() => {
		switch (notification.action) {
			case "Like post": {
				setAction("like your post.");
				break;
			}
			default: {
				setAction("hello");
			}
		}
	}, []);

	return (
		<div
			className={`ml-2 flex items-center my-1 py-2 px-1 cursor-pointer  ${
				notification.viewed
					? "bg-blue-100 hover:bg-blue-200"
					: " hover:bg-gray-200"
			}`}
		>
			{/* PROFILE IMAGE */}
			<img
				src={notification.senderProfileImagePath}
				alt="Sender profile image"
				className="rounded-full max-w-16"
			/>
			{/* ACTION & TIME */}
			<div className="ml-2">
				{/* NAME */}
				<p>
					<span className="font-semibold">{notification.senderName}</span>{" "}
					{action}
				</p>
				{/* TIME */}
				<p>{formatDateTime(notification.createdAt)}</p>
			</div>
		</div>
	);
};

export default Notification;
