import React, { useEffect, useContext, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackArrow from "../BackArrow/BackArrow.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import Error from "../Error.jsx";
import SendMessage from "./SendMessage.jsx";
import Messages from "./Messages.jsx";
import { ServerContext } from "../../App.js";

const ChatPage = () => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [loading, setLoading] = useState(true);
	const [imagePath, setImagePath] = useState("");
	const [userName, setUserName] = useState("");
	const [profileFrameColor, setProfileFrameColor] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const { friendId } = useParams();
	const scroll = useRef(null);
	const [finish, setFinish] = useState(false);

	// retrieve user name and profile image
	useEffect(() => {
		const retrieveUser = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/chat/retrieve-user?userId=${friendId}`,
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
					setFinish(true);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, friend } = await res.json();

				if (msg === "Success") {
					setImagePath(friend.imagePath);
					setUserName(friend.userName);
					setFinish(true);
					setProfileFrameColor(friend.profileFrameColor);
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				setFinish(true);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
				setFinish(true);
			}
		};

		retrieveUser();
	}, []);

	useEffect(() => {
		if (finish) {
			scroll.current.scrollIntoView({ behavior: "instant", block: "end" });
		}
	}, [finish]);

	return user && token ? (
		<div className="h-full flex flex-col">
			{/* HEADER */}
			<div className="flex px-3 pt-3 pb-1 bg-[#0F1035]">
				{/* BACK ARROW */}
				<BackArrow white={true} />
				{/* PROFILE IMAGE & USER NAME */}
				{loading ? (
					<Spinner />
				) : (
					<div className="flex items-center">
						<img
							src={imagePath}
							alt="Friend image path"
							className={`rounded-full w-12 h-12 object-cover mx-3 border-2 ${profileFrameColor}`}
						/>
						<p className="text-white">{userName}</p>
					</div>
				)}
			</div>
			<div className={"right-0 left-0 flex-1 flex flex-col overflow-y-auto"}>
				{/* MESSAGES */}
				<Messages imagePath={imagePath} scroll={scroll} />
				{/* SEND MESSAGE */}
				<SendMessage scroll={scroll} />
			</div>
		</div>
	) : (
		<Error />
	);
};

export default ChatPage;
