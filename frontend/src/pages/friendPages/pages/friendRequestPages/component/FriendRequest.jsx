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
		<div className="rounded-xl p-3 my-2 border border-gray-300 shadow-xl col-span-12 md:col-span-4 lg:col-span-3 flex flex-row md:flex-col items-center">
			{loading && <Spinner />}
			{/* IMAGE */}
			<img
				src={profileImagePath}
				alt="User profile image"
				className={`border-[2.5px] md:border-4 ${friendRequest.requestorId.userProfile.profileFrameColor} rounded-full w-16 h-16 md:w-32 md:h-32 object-cover md:self-center`}
			/>
			<div className="flex-1 flex flex-col w-full justify-between ml-3 md:ml-0 md:mt-3">
				{/* USER NAME */}
				<div className="md:text-xl md:mx-auto flex mb-2">
					<p
						className="cursor-pointer hover:opacity-80"
						onClick={handleNavigate}
					>
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
				<div>
					{/* ACCEPT BUTTON */}
					<button
						className="btn-green mr-3 min-w-24 md:flex-1 md:w-full"
						onClick={handleAccept}
					>
						Accept
					</button>
					{/* REJECT BUTTON */}
					<button
						className="btn-red min-w-24 md:flex-1 md:w-full md:mt-2 mt-0"
						onClick={handleReject}
					>
						Reject
					</button>
				</div>
			</div>
		</div>
	);
};

export default FriendRequest;
