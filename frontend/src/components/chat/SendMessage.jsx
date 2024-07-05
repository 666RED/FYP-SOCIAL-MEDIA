import React, { useState, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdSend } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import Spinner from "../Spinner/Spinner.jsx";
import SendImage from "./SendImage.jsx";
import { ServerContext } from "../../App.js";

const SendMessage = ({ scroll }) => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [message, setMessage] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const { friendId } = useParams();
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState({});
	const [imagePath, setImagePath] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (message.trim() === "" && imagePath === "") {
				enqueueSnackbar("Please enter your message", { variant: "warning" });
				return;
			}

			setLoading(true);

			let type;
			if (imagePath === "") {
				type = "message";
			} else {
				type = "image";
			}

			const formdata = new FormData();
			formdata.append("userName", user.userName);
			formdata.append("userId", user._id);
			formdata.append("friendId", friendId);
			formdata.append("message", message);
			formdata.append("image", image);
			formdata.append("type", type);

			const res = await fetch(`${serverURL}/chat/send-message`, {
				method: "POST",
				body: formdata,
				headers: {
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
				setImage({});
				setImagePath("");
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

	useEffect(() => {
		document.querySelector("#text-input").focus();
	}, []);

	const handleClick = () => {
		const file = document.getElementById("img-file");
		file.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const newImagePath = URL.createObjectURL(file);
			setImage(file);
			setImagePath(newImagePath);
		}
	};

	return (
		<form
			className="bg-[#0F1035] w-full py-4 px-3 flex items-center"
			onSubmit={handleSubmit}
			autoComplete="off"
		>
			{/* SEND IMAGE */}
			{imagePath !== "" && (
				<SendImage
					handleSubmit={handleSubmit}
					setImagePath={setImagePath}
					imagePath={imagePath}
					loading={loading}
				/>
			)}
			{loading && <Spinner />}
			{/* IMAGE ICON */}
			<FaImage
				className="text-3xl text-blue-600 cursor-pointer hover:text-white"
				onClick={handleClick}
			/>
			{/* INPUT */}
			<input
				type="text"
				className="flex-1 mx-3"
				placeholder="Type your message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				max={2000}
				required
				id="text-input"
			/>
			{/* SEND BUTTON */}
			<button>
				<MdSend className="icon rounded-full bg-[#ADD8E6] text-4xl p-1 hover:text-white" />
			</button>
			{/* FILE INPUT */}
			<input
				className="hidden"
				type="file"
				id="img-file"
				accept="image/*"
				onChange={handleImageChange}
			/>
		</form>
	);
};

export default SendMessage;
