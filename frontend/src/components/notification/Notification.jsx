import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FaThumbsUp, FaThumbsDown, FaUserGroup } from "react-icons/fa6";
import { FaCommentAlt, FaUser } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";
import Action from "./Action.jsx";

import { formatDateTimeForFirebaseDoc } from "../../usefulFunction.js";
import { ServerContext } from "../../App.js";

const Notification = ({ notification }) => {
	const serverURL = useContext(ServerContext);
	const [action, setAction] = useState("");
	const [func, setFunc] = useState(null);
	const navigate = useNavigate();
	const [icon, setIcon] = useState();
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();

	const updateViewed = async () => {
		try {
			const res = await fetch(`${serverURL}/notification/update-viewed`, {
				method: "PATCH",
				body: JSON.stringify({
					id: notification.id,
					viewed: notification.viewed,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg } = await res.json();

			if (msg === "Success") {
				console.log("Viewed has set to false");
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	// determine action
	useEffect(() => {
		switch (notification.action) {
			case "Like post": {
				setAction(
					<Action actor={notification.userName} action={"liked your post"} />
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-post/${notification.postId}/0`);
				});
				setIcon(
					<FaThumbsUp className="absolute -right-0 bottom-0 text-2xl bg-blue-600 rounded-full p-1" />
				);
				break;
			}
			case "Comment post": {
				setAction(
					<Action
						action={"commentd on your post"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-post/${notification.postId}/0`);
				});
				setIcon(
					<FaCommentAlt className="absolute -right-0 bottom-0 text-2xl bg-green-600 rounded-full p-1" />
				);

				break;
			}
			case "Rate up": {
				setAction(
					<Action
						action={"rated up on your campus condition"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-condition/${notification.conditionId}`);
				});
				setIcon(
					<FaThumbsUp className="absolute -right-0 bottom-0 text-2xl bg-blue-600 rounded-full p-1" />
				);

				break;
			}
			case "Rate down": {
				setAction(
					<Action
						action={"rated down on your campus condition"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-condition/${notification.conditionId}`);
				});
				setIcon(
					<FaThumbsDown className="absolute -right-0 bottom-0 text-2xl bg-red-600 rounded-full p-1" />
				);

				break;
			}
			case "Mark resolved": {
				setAction(
					<Action
						action={"marked resolved on your campus condition"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-condition/${notification.conditionId}`);
				});

				break;
			}
			case "Add friend": {
				setAction(
					<Action
						action={"sent you a friend request"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate("/friend/friend-request");
				});
				setIcon(
					<FaUser className="absolute -right-0 bottom-0 text-2xl bg-yellow-600 rounded-full p-1" />
				);
				break;
			}
			case "Accept friend request": {
				setAction(
					<Action
						action={"accepted your friend request"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					const previousArr =
						JSON.parse(localStorage.getItem("previous")) || [];
					previousArr.push(`/home`);
					localStorage.setItem("previous", JSON.stringify(previousArr));
					navigate(`/profile/${notification.acceptUserId}`);
				});
				setIcon(
					<FaUser className="absolute -right-0 bottom-0 text-2xl bg-green-600 rounded-full p-1" />
				);

				break;
			}
			case "Join group": {
				setAction(
					<Action
						action={"sent a join group request"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/group/${notification.groupId}`);
				});
				setIcon(
					<FaUserGroup className="absolute -right-0 bottom-0 text-2xl bg-yellow-600 rounded-full p-1" />
				);

				break;
			}
			case "Accept join group": {
				setAction(
					<p>
						<span className="font-semibold">{`${notification.groupName}'s group admin`}</span>{" "}
						accepted your join group request
					</p>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/group/${notification.acceptGroupId}`);
				});
				setIcon(
					<FaUserGroup className="absolute -right-0 bottom-0 text-2xl bg-green-600 rounded-full p-1" />
				);

				break;
			}
			case "Like group post": {
				setAction(
					<Action
						action={"liked your group post"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-group-post/${notification.postId}`);
				});
				setIcon(
					<FaThumbsUp className="absolute -right-0 bottom-0 text-2xl bg-blue-600 rounded-full p-1" />
				);

				break;
			}
			case "Comment group post": {
				setAction(
					<Action
						action={"commented on your group post"}
						actor={notification.userName}
					/>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(`/notification/view-group-post/${notification.postId}`);
				});
				setIcon(
					<FaCommentAlt className="absolute -right-0 bottom-0 text-2xl bg-green-600 rounded-full p-1" />
				);

				break;
			}
			case "Add note": {
				setAction(
					<p>
						New note added in{" "}
						<span className="font-semibold">{notification.groupName}</span>
					</p>
				);
				setFunc(() => () => {
					updateViewed();
					navigate(
						`/group/${notification.acceptGroupId}/view-notes/${notification.folderId}/1`
					);
				});
				setIcon(
					<MdNoteAdd className="absolute -right-0 bottom-0 text-2xl bg-green-600 rounded-full p-1" />
				);

				break;
			}
			default: {
				setAction("");
			}
		}
	}, [notification]);

	return (
		<div
			className={`flex items-center py-2 px-1 cursor-pointer ${
				!notification.viewed
					? "bg-blue-100 hover:bg-blue-200"
					: " hover:bg-gray-200"
			}`}
			onClick={func}
		>
			{/* IMAGE AND ICON */}
			<div className="relative">
				<img
					src={
						notification.type === "Admin"
							? "https://firebasestorage.googleapis.com/v0/b/final-year-project-d85b9.appspot.com/o/profile%2F1717782508432-administrators-6.png?alt=media&token=fd47405a-5f4d-444d-8b81-3c44905a2839"
							: notification.imagePath
					}
					alt="Sender profile image"
					className="rounded-full w-16 h-16 object-cover"
				/>
				{icon}
			</div>

			{/* ACTION & TIME */}
			<div className="ml-2">
				{/* NAME */}
				{action}
				{/* TIME */}
				<p className="text-xs text-gray-600">
					{formatDateTimeForFirebaseDoc(notification.createdAt)}
				</p>
			</div>
		</div>
	);
};

export default Notification;
