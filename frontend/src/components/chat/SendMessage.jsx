import React, { useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdSend } from "react-icons/md";
import Spinner from "../Spinner/Spinner.jsx";
import { ServerContext } from "../../App.js";

const SendMessage = ({ scroll }) => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [message, setMessage] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const { friendId } = useParams();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (message.trim() === "") {
				enqueueSnackbar("Please enter your message", { variant: "warning" });
				return;
			}

			setLoading(true);

			const res = await fetch(`${serverURL}/chat/send-message`, {
				method: "POST",
				body: JSON.stringify({
					userName: user.userName,
					userId: user._id,
					friendId: friendId,
					message,
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
				setMessage("");
				setTimeout(() => {
					scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
				}, 100);
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	return (
		<form
			className="bg-[#0F1035] w-full py-4 px-3 flex items-center"
			onSubmit={handleSubmit}
		>
			{loading && <Spinner />}
			{/* INPUT */}
			<input
				type="text"
				className="flex-1 mr-3"
				placeholder="Type your message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				max={2000}
				required
			/>
			{/* SEND BUTTON */}
			<button>
				<MdSend className="icon rounded-full bg-[#ADD8E6] text-4xl p-1 hover:text-white" />
			</button>
		</form>
	);
};

export default SendMessage;
