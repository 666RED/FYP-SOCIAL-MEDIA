import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { FaImage } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { addNewPost } from "../../../features/homeSlice.js";
import Spinner from "../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../App.js";

const AddNewPost = () => {
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const [text, setText] = useState("");
	const [image, setImage] = useState({});
	const [imagePath, setImagePath] = useState("");
	const [showFull, setShowFull] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleOnClick = () => {
		if (text === "" && !showFull) {
			setShowFull(true);
		}
	};

	const handleDiscard = () => {
		if (text !== "" || imagePath !== "") {
			const ans = window.confirm("Disard changes?");

			if (ans) {
				setText("");
				setImage({});
				setImagePath("");
				setShowFull(false);
			}
		} else {
			setShowFull(false);
		}
	};

	const handleUploadImage = () => {
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

	const handleRemove = () => {
		const ans = window.confirm("Remove image?");
		if (ans) {
			setImage({});
			setImagePath("");
		}
	};

	const resetState = () => {
		setText("");
		setImage({});
		setImagePath("");
		setShowFull(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (text.trim() === "") {
				enqueueSnackbar("Please enter post description", {
					variant: "warning",
				});
				return;
			}

			setLoading(true);

			const formdata = new FormData();

			formdata.append("text", text);
			formdata.append("image", image);
			formdata.append("userId", user._id);

			const res = await fetch(`${serverURL}/post/add-new-post`, {
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

			const { msg, returnPost } = await res.json();

			if (msg == "Success") {
				enqueueSnackbar("New post added", {
					variant: "success",
				});
				sliceDispatch(addNewPost({ ...returnPost, type: "Post" }));
				resetState();
			} else if (msg === "Post not found") {
				enqueueSnackbar("Post not found", {
					variant: "error",
				});
			} else if (msg === "Fail to add new post") {
				enqueueSnackbar("Fail to add new post", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			setLoading(false);
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<form
			className="bg-white rounded-xl shadow-2xl component-layout py-2 px-3 mb-2"
			onSubmit={handleSubmit}
		>
			{loading && <Spinner />}
			{/* UPPER ROW */}
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					{/* PROFILE IMAGE */}
					<img
						src={user.userProfile.profileImagePath}
						alt=""
						className={`rounded-full mr-2 border-[2.5px] object-cover ${user.userProfile.profileFrameColor} md:w-14 w-12 md:h-14 h-12`}
					/>
					{/* USERNAME */}
					<p>{user.userName}</p>
				</div>
				{/* DISCARD BUTTON */}
				{showFull && (
					<button
						className="btn-gray md:text-base text-sm"
						onClick={handleDiscard}
					>
						DISCARD
					</button>
				)}
			</div>
			{/* INPUT */}
			<textarea
				id="text-description"
				value={text}
				onChange={(e) => {
					setText(e.target.value);
				}}
				onClick={handleOnClick}
				className="w-full resize-none my-2 transition-all"
				rows={showFull ? 6 : 1}
				maxLength={2000}
				required
				placeholder="Share your thoughts..."
			/>
			{/* IMAGE */}
			{imagePath !== "" && (
				<img
					src={imagePath}
					alt="Post image"
					className={`rounded-xl max-img-height mb-3 cursor-pointer hover:opacity-70 mx-auto`}
					onClick={handleUploadImage}
				/>
			)}
			{/* LOWER ROW */}
			{showFull && (
				<div>
					<div className="flex items-center justify-between">
						{/* UPLOAD IMAGE */}
						{imagePath === "" ? (
							<div
								className="flex items-center hover:opacity-70 cursor-pointer"
								onClick={handleUploadImage}
							>
								{/* ICON */}
								<FaImage className="mr-2 text-xl" />
								{/* TEXT */}
								<p className="select-none font-semibold">Upload image</p>
							</div>
						) : (
							// REMOVE IMAGE
							<div
								className="flex items-center text-red-600 hover:opacity-70 cursor-pointer"
								onClick={handleRemove}
							>
								{/* ICON */}
								<MdDeleteForever className="mr-1 text-xl" />
								{/* TEXT */}
								<p>Remove Image</p>
							</div>
						)}

						{/* SUBMIT BUTTON */}
						<button className="btn-green md:text-base text-sm w-3/12">
							POST
						</button>
					</div>
					<input
						className="hidden"
						type="file"
						id="img-file"
						accept="image/*"
						onChange={handleImageChange}
					/>
				</div>
			)}
		</form>
	);
};

export default AddNewPost;
