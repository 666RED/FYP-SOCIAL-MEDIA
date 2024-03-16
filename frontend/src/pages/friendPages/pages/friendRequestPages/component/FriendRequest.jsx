import { React, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { FaMale, FaFemale } from "react-icons/fa";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import { removeFriendRequest } from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";

const FriendRequest = ({ friendRequest }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const profileImagePath =
		friendRequest.requestorId.userProfile.profileImagePath;
	const filePath = `${serverURL}/public/images/profile/${profileImagePath}`;
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const handleAccept = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`${serverURL}/friend-request/accept-friend-request`,
				{
					method: "PATCH",
					body: JSON.stringify({
						requestorId: friendRequest.requestorId._id,
						receiverId: user._id,
						friendRequestId: friendRequest._id,
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

			const { msg, updatedFriendRequest, updatedUser } = await res.json();

			if (msg === "Success") {
				sliceDispatch(removeFriendRequest(updatedFriendRequest._id));
				enqueueSnackbar("Friend request accepted", { variant: "success" });
			} else if (msg === "User not found" || msg === "Friend not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else if (msg === "Friend request not found or already accepted") {
				enqueueSnackbar("Friend request not found or already accepted", {
					variant: "error",
				});
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

	const handleReject = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`${serverURL}/friend-request/reject-friend-request`,
				{
					method: "DELETE",
					body: JSON.stringify({
						friendRequestId: friendRequest._id,
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

			const { msg } = await res.json();

			if (msg === "Success") {
				sliceDispatch(removeFriendRequest(friendRequest._id));
				enqueueSnackbar("Friend request rejected", { variant: "success" });
			} else if (msg === "Friend request not found") {
				enqueueSnackbar("Fail to reject friend request", { variant: "error" });
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

	const handleNavigate = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/friend/friend-request`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${friendRequest.requestorId._id}`);
	};

	return (
		<div className="rounded-xl p-3 my-2 border border-gray-300 shadow-xl col-span-12 md:col-span-4 lg:col-span-3 grid grid-cols-12 grid-rows-2 md:flex md:flex-col items-center md:items-start gap-x-12">
			{loading && <Spinner />}
			{/* IMAGE */}
			<img
				src={filePath}
				alt="User profile image"
				className="col-span-2 row-span-3 border border-blue-400 rounded-full max-w-20 md:max-w-32 md:self-center"
			/>
			{/* USER NAME */}
			<div className="col-span-8 md:my-3 md:text-xl md:flex-1 flex">
				<p className="cursor-pointer hover:opacity-80" onClick={handleNavigate}>
					{friendRequest.requestorId.userName}
					{/* GENDER */}
					{friendRequest.requestorId.userGender === "male" ? (
						<FaMale className="text-blue-500 inline" />
					) : (
						<FaFemale className="text-pink-500 inline" />
					)}
				</p>
			</div>

			{/* BUTTONS ROW */}
			<div className="col-span-8 md:flex md:w-full">
				<button
					className="btn-green mr-3 min-w-24 md:flex-1"
					onClick={handleAccept}
				>
					Accept
				</button>
				<button className="btn-red min-w-24 md:flex-1" onClick={handleReject}>
					Reject
				</button>
			</div>
		</div>
	);
};

export default FriendRequest;
