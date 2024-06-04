import { React, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaMale, FaFemale } from "react-icons/fa";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import {
	removeRandomFriend,
	removeOriginalRandomFriend,
	setHasRandomFriends,
} from "../../../../features/friendSlice.js";
import { ServerContext } from "../../../../App.js";
import { setSearchText } from "../../../../features/searchSlice.js";

const RandomFriend = ({ randomFriend, toggleEmptyText }) => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [loading, setLoading] = useState(false);
	const sliceDispatch = useDispatch();

	const filePath = `${serverURL}/public/images/profile/`;

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/friend/explore-friend`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${randomFriend._id}`);
	};

	const handleAddFriend = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${serverURL}/friend-request/send-friend-request`,
				{
					method: "POST",
					body: JSON.stringify({
						requestorId: user._id,
						receiverId: randomFriend._id,
					}),
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

			const response = await res.json();

			if (response.msg === "Success") {
				enqueueSnackbar("Friend request sent", { variant: "success" });
				sliceDispatch(removeRandomFriend(randomFriend._id));
				sliceDispatch(removeOriginalRandomFriend(randomFriend._id));
				sliceDispatch(setSearchText(""));
				toggleEmptyText((prev) => !prev);
			} else if (response.msg === "Friend request not created") {
				enqueueSnackbar("Fail to send friend request", { variant: "error" });
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
		<div className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl p-3 my-2 border shadow-xl border-gray-300 grid grid-cols-12 items-center md:flex md:flex-col">
			{loading && <Spinner />}
			{/* PROFILE IMAGE */}
			<img
				src={`${filePath}${randomFriend.userProfile.profileImagePath}`}
				alt="Random friend profile image"
				className={`col-span-2 md:max-w-24 border-[2.5px] md:border-4 ${randomFriend.userProfile.profileFrameColor} rounded-full`}
			/>
			{/* USER NAME AND FRIEND COUNT DIV */}
			<div className="col-span-6 md:my-3 md:flex-1 flex-col ml-2">
				{/* USER NAME */}
				<p
					onClick={handleOnClick}
					className="cursor-pointer hover:opacity-80 inline text-sm md:text-base"
				>
					{randomFriend.userName}
					{/* GENDER */}
					{randomFriend.userGender === "male" ? (
						<FaMale className="text-blue-500 inline" />
					) : (
						<FaFemale className="text-pink-500 inline" />
					)}
				</p>
				{/* FRIENDS AMOUNT */}
				<p className="text-sm md:text-base">
					{Object.keys(randomFriend.userFriendsMap).length}{" "}
					{Object.keys(randomFriend.userFriendsMap).length > 1
						? "friends"
						: "friend"}
				</p>
			</div>

			{/* FRIEND STATUS BUTTON */}

			<div className="col-span-4 md:w-full">
				<button
					className="btn-blue text-sm sm:text-base w-full"
					onClick={handleAddFriend}
				>
					Add Friend
				</button>
			</div>
		</div>
	);
};

export default RandomFriend;
