import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdCancel } from "react-icons/md";
import Loader from "../../../components/Spinner/Loader.jsx";
import Chat from "./Chat.jsx";
import { ServerContext } from "../../../App.js";
import { MessageContext } from "../../../App.js";

const MessagesContainer = ({ showChats, toggleShowChats }) => {
	const serverURL = useContext(ServerContext);
	const { chats } = useContext(MessageContext);
	const [loading, setLoading] = useState(false);
	const [allChats, setAllChats] = useState([]);
	const { token, user } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();

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
	}, []);

	return (
		<div className="absolute right-0 bg-white top-10 shadow-2xl rounded-xl min-w-[30rem] min-h-[7rem] overflow-hidden">
			<div className="ml-2 mt-2 flex items-center sticky top-0 z-40">
				{/* TITLE */}
				<h2 className="font-semibold">Chats</h2>
			</div>
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

export default MessagesContainer;
