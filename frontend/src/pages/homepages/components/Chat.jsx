import { React, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa6";
import Spinner from "../../../components/Spinner/Spinner.jsx";
import { formatDateTimeForFirebaseDoc } from "../../../usefulFunction.js";
import { ServerContext } from "../../../App.js";

const Chat = ({ chat }) => {
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { user, token } = useSelector((store) => store.auth);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleNavigate = async () => {
		try {
			setLoading(true);
			const res = await fetch(`${serverURL}/chat/update-viewed`, {
				method: "PATCH",
				body: JSON.stringify({
					receiverId: user._id.toString(),
					senderId: chat.sender.toString(),
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				setLoading(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg } = await res.json();

			if (msg === "Success") {
				console.log("Chats viewed updated successfully");
			} else {
				console.log("Fail to update chats viewed");
			}

			setLoading(false);

			const friendId =
				chat.sender.toString() === user._id.toString()
					? chat.receiver
					: chat.sender;

			const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
			previousArr.push(`/home/0`);
			localStorage.setItem("previous", JSON.stringify(previousArr));
			navigate(`/chat/${friendId}`);
		} catch (err) {
			setLoading(false);
			console.log("Fail to update chats viewed");
		}
	};

	return (
		<div
			className="flex items-center py-2 px-1 cursor-pointer hover:bg-gray-200"
			onClick={handleNavigate}
		>
			{loading && <Spinner />}
			{/* IMAGE AND ICON */}
			<div className="relative">
				<img
					src={chat.imagePath}
					alt="Sender profile image"
					className="rounded-full w-16 h-16 object-cover"
				/>
			</div>
			<div className="ml-2">
				{/* NAME */}
				<p className="font-semibold select-none">{chat.userName}</p>
				{/* MESSAGE & TIME */}
				<div className="flex items-center">
					{/* CIRCLE ICON */}
					{!chat.viewed && chat.sender.toString() !== user._id.toString() && (
						<FaCircle className="text-xs text-blue-500 mr-3 select-none" />
					)}
					{/* MESSAGE */}
					<p
						className={`${
							!chat.viewed && chat.sender.toString() !== user._id.toString()
								? "text-black font-semibold"
								: "text-gray-500"
						} select-none`}
					>
						{windowWidth >= 640
							? chat.message.length > 35
								? `${chat.message.slice(0, 36)}...`
								: chat.message
							: chat.message.length > 15
							? `${chat.message.slice(0, 16)}...`
							: chat.message}
					</p>
					{/* TIME */}
					<p className="text-gray-500 ml-3 select-none">
						{formatDateTimeForFirebaseDoc(chat.createdAt)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Chat;
