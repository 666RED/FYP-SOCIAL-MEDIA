import { React, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaMale, FaFemale } from "react-icons/fa";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import { removeFriend } from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";
import { setSearchText } from "../../../../../features/searchSlice.js";
import ContactButton from "../../../../marketplacePages/pages/mainPages/components/ContactButton.jsx";

const Friend = ({ friend }) => {
	const sliceDispatch = useDispatch();
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/friend`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${friend._id}`);
	};

	const handleRemoveFriend = async () => {
		try {
			const ans = window.confirm("Remove friend?");
			if (ans) {
				setLoading(true);
				const res = await fetch(`${serverURL}/friend/direct-remove-friend`, {
					method: "DELETE",
					body: JSON.stringify({
						requestorId: user._id,
						receiverId: friend._id,
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

				const { msg, friendsArr } = await res.json();

				if (msg === "Success") {
					sliceDispatch(removeFriend(friendsArr));
					sliceDispatch(setSearchText(""));
					enqueueSnackbar("Friend removed", {
						variant: "success",
					});
				} else if (msg === "Friend request not found") {
					enqueueSnackbar("Friend request not found", {
						variant: "error",
					});
				} else if (msg === "User not found" || msg === "Friend not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	return (
		<div className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl p-3 my-2 border shadow-xl border-gray-300 grid grid-cols-12 items-center md:flex md:flex-col">
			{loading && <Spinner />}
			{/* PROFILE IMAGE */}
			<img
				src={friend.userProfile.profileImagePath}
				alt="Friend profile image"
				className={`col-span-2 min-w-12 md:max-w-24 border-[2.5px] md:border-4 ${friend.userProfile.profileFrameColor} rounded-full`}
			/>
			{/* USER NAME AND FRIEND COUNT DIV */}
			<div className="col-span-6 md:my-3 md:flex-1 flex-col ml-2">
				{/* USER NAME */}
				<p
					onClick={handleOnClick}
					className="cursor-pointer hover:opacity-80 inline"
				>
					{friend.userName}
					{/* GENDER */}
					{friend.userGender === "male" ? (
						<FaMale className="text-blue-500 inline" />
					) : (
						<FaFemale className="text-pink-500 inline" />
					)}
				</p>
				{/* FRIENDS AMOUNT */}
				<p>
					{Object.keys(friend.userFriendsMap).length}{" "}
					{Object.keys(friend.userFriendsMap).length > 1 ? "friends" : "friend"}
				</p>
			</div>

			{/* BUTTONS */}
			<div className="col-span-4 md:w-full">
				{/* VIEW PROFILE BUTTON */}
				<button
					className="btn-gray w-full text-sm sm:text-base"
					onClick={handleOnClick}
				>
					View Profile
				</button>
				{/* CONTACT BUTTON */}
				<ContactButton contactUserId={friend._id} path="/friend" text="Chat" />
				{/* UNFRIEND BUTTON */}
				<button
					className="btn-red text-sm sm:text-base w-full mt-2"
					onClick={handleRemoveFriend}
				>
					Unfriend
				</button>
			</div>
		</div>
	);
};

export default Friend;
