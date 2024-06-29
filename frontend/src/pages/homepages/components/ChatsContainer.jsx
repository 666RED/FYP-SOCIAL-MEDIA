import React, { useState, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdCancel } from "react-icons/md";
import Loader from "../../../components/Spinner/Loader.jsx";
import Chat from "./Chat.jsx";
import { ServerContext } from "../../../App.js";
import { MessageContext } from "../../../App.js";

const ChatsContainer = ({ showChats, setShowChats }) => {
	const serverURL = useContext(ServerContext);
	const { chats } = useContext(MessageContext);
	const [loading, setLoading] = useState(false);
	const [allChats, setAllChats] = useState([]);
	const { token, user } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const containerRef = useRef();

	useEffect(() => {
		const getChats = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/chat/get-chats-profile?chats=${JSON.stringify({
						chats: chats.map((chat) => {
							if (chat.sender.toString() !== user._id.toString()) {
								return {
									id: chat.id,
									friendId: chat.sender,
								};
							} else {
								return {
									id: chat.id,
									friendId: chat.receiver,
								};
							}
						}),
					})}`,
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

				const { msg, returnedChats } = await res.json();

				if (msg === "Success") {
					setAllChats(
						returnedChats.map((returnedChat) => {
							const matchedChat = chats.find(
								(chat) => chat.id === returnedChat.id
							);

							if (matchedChat) {
								return {
									...matchedChat,
									imagePath: returnedChat.imagePath,
									userName: returnedChat.userName,
								};
							}
							return matchedChat;
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

		getChats();
	}, [chats]);

	// close container
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target) &&
				!(
					document.getElementById("chat-icon") &&
					document.getElementById("chat-icon").contains(event.target)
				)
			) {
				setShowChats(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className={`absolute bg-white top-10 shadow-[rgba(0,0,0,0.1)_0px_0px_7px_7px] rounded-xl sm:min-w-[30rem] sm:-right-12 min-w-[18rem] -right-12 min-h-[6rem] max-h-[35rem] overflow-x-hidden overflow-y-auto messages ${
				showChats ? "visible" : "hidden"
			}`}
			ref={containerRef}
		>
			{/* TITLE */}
			<h2 className="font-semibold sticky top-0 z-40 py-1 indent-2 bg-white">
				Chats
			</h2>
			{/* CHATS */}
			{loading ? (
				<Loader />
			) : allChats.length > 0 ? (
				allChats.map((chat, index) => <Chat chat={chat} key={index} />)
			) : (
				<h2 className="text-center">No chat...</h2>
			)}
		</div>
	);
};

export default ChatsContainer;
