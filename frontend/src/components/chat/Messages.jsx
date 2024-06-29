import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import {
	query,
	where,
	collection,
	onSnapshot,
	orderBy,
} from "firebase/firestore";
import { db } from "../../firebase-config.js";
import Message from "./Message.jsx";
import { formatDateForFirebaseDoc } from "../../usefulFunction.js";
import { ServerContext } from "../../App.js";

const Messages = ({ imagePath, scroll }) => {
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const [messages, setMessages] = useState([]);
	const { friendId } = useParams();
	const { user, token } = useSelector((store) => store.auth);

	useEffect(() => {
		let first1 = true;
		let first2 = true;
		const messageRef = collection(db, "messages");

		const query1 = query(
			messageRef,
			where("receiver", "==", user._id.toString()),
			where("sender", "==", friendId.toString()),
			orderBy("createdAt")
		);

		const query2 = query(
			messageRef,
			where("receiver", "==", friendId.toString()),
			where("sender", "==", user._id.toString()),
			orderBy("createdAt")
		);

		// receive message
		const unsubscribe1 = onSnapshot(query1, (snapshot1) => {
			const newMessages = [];
			const addedMessages = [];

			snapshot1.docChanges().forEach((change) => {
				const data = change.doc.data();
				const id = change.doc.id;
				const message = { id, ...data };

				newMessages.push(message);

				if (change.type === "added") {
					addedMessages.push(message);
				}
			});

			if (first1) {
				setMessages((prev) => [...prev, ...newMessages]);
			} else {
				if (addedMessages.length > 0) {
					updateView();
					setMessages((prev) => [...prev, ...addedMessages]);
					setTimeout(() => {
						scroll.current.scrollIntoView({
							behavior: "smooth",
							block: "end",
						});
					}, 100);
				}
			}

			first1 = false;
		});

		// Send message
		const unsubscribe2 = onSnapshot(query2, (snapshot2) => {
			const newMessages = [];
			const addedMessages = [];
			const updateMessages = [];

			snapshot2.docChanges().forEach((change) => {
				const data = change.doc.data();
				const id = change.doc.id;
				const message = { id, ...data };

				newMessages.push(message);

				if (change.type === "added") {
					addedMessages.push(message);
				} else if (change.type === "modified") {
					updateMessages.push(message);
				}
			});

			if (first2) {
				setMessages((prev) => [...prev, ...newMessages]);
			} else {
				if (addedMessages.length > 0) {
					setMessages((prev) => [...prev, ...addedMessages]);
					setTimeout(() => {
						scroll.current.scrollIntoView({
							behavior: "smooth",
							block: "end",
						});
					}, 100);
				} else if (updateMessages.length > 0) {
					setMessages((prev) => {
						return prev.map((message) =>
							message.id === updateMessages[0].id ? updateMessages[0] : message
						);
					});
					setTimeout(() => {
						scroll.current.scrollIntoView({
							behavior: "smooth",
							block: "end",
						});
					}, 100);
				}
			}

			first2 = false;
		});

		return () => {
			unsubscribe1();
			unsubscribe2();
		};
	}, []);

	const updateView = async () => {
		try {
			const res = await fetch(`${serverURL}/chat/update-viewed`, {
				method: "PATCH",
				body: JSON.stringify({
					receiverId: user._id.toString(),
					senderId: friendId.toString(),
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
				console.log("Chats viewed updated successfully");
			} else {
				console.log("Fail to update chats viewed");
			}
		} catch (err) {
			console.log("Fail to update chats viewed");
		}
	};

	// sort message
	useEffect(() => {
		setMessages((prevMessages) =>
			prevMessages.sort((a, b) => a.createdAt - b.createdAt)
		);
	}, [messages]);

	return (
		<div
			className={`overflow-y-auto px-2 bg-[#365486] pt-2 flex-1 relative`}
			id="messages"
		>
			{messages.length > 0 ? (
				// MESSAGES
				messages.map((message, id) => {
					const formattedDate = formatDateForFirebaseDoc(message.createdAt);
					const lastElement = id === messages.length - 1;
					const showDate =
						id === 0 ||
						formattedDate !==
							formatDateForFirebaseDoc(messages[id - 1]?.createdAt);

					return (
						<div key={id}>
							{showDate && (
								// DATE
								<div>
									<p className="text-center p-2 bg-gray-500 w-1/12 min-w-fit mx-auto rounded-2xl mb-2 text-white">
										{formattedDate}
									</p>
								</div>
							)}
							{/* MESSAGE */}
							<Message
								currentMessage={message}
								key={id}
								imagePath={imagePath}
								lastElement={lastElement}
							/>
							{/* SEEN */}
							{id === messages.length - 1 &&
								message.viewed &&
								message.sender.toString() === user._id.toString() && (
									<p className="text-end text-white mr-2">Seen</p>
								)}
						</div>
					);
				})
			) : (
				// NO MESSAGE
				<p className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-white text-2xl">
					No messages...
				</p>
			)}
			<span ref={scroll}></span>
		</div>
	);
};

export default Messages;
