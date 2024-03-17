import { React, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaMale, FaFemale } from "react-icons/fa";
import FriendStatusButton from "../../../../components/FriendStatusButton.jsx";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../../App.js";

const RandomFriend = ({ randomFriend }) => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [loading, setLoading] = useState(false);
	const [friendStatus, setFriendStatus] = useState("Not friend");
	const [friendRequestId, setFriendRequestId] = useState("");

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
				setFriendStatus("Pending");
				setFriendRequestId(response.savedFriendRequest._id);
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

	const handleCancelRequest = async () => {
		try {
			const ans = window.confirm("Cancel friend request?");
			if (ans) {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/friend-request/cancel-friend-request`,
					{
						method: "DELETE",
						body: JSON.stringify({
							friendRequestId,
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
					setFriendRequestId("");
					setFriendStatus("Not friend");
					enqueueSnackbar("Friend request cancelled", {
						variant: "success",
					});
				} else if (response.msg === "Friend request not found") {
					enqueueSnackbar("Fail to cancel friend reqeust", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
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
				src={`${filePath}${randomFriend.userProfile.profileImagePath}`}
				alt="Random friend profile image"
				className="col-span-2 md:max-w-24 border border-blue-400 rounded-full "
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
				<FriendStatusButton
					friendStatus={friendStatus}
					functions={{
						handleAddFriend,
						handleCancelRequest,
						toggleShowRespondForm: null,
						handleRemoveFriend: null,
					}}
					needsIcon={false}
				/>
			</div>
		</div>
	);
};

export default RandomFriend;
