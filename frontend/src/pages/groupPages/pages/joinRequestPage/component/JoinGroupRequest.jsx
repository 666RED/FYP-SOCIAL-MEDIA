import { React, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { FaMale, FaFemale } from "react-icons/fa";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import { removeJoinGroupRequest } from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const JoinGroupRequest = ({ joinGroupRequest }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const profileImagePath =
		joinGroupRequest.requestorId.userProfile.profileImagePath;
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { groupId } = useParams();

	const handleAccept = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch(
				`${serverURL}/join-group-request/accept-join-group-request`,
				{
					method: "PATCH",
					body: JSON.stringify({
						requestorId: joinGroupRequest.requestorId._id,
						groupId: groupId,
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

			const { msg, joinGroupRequestId } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Join group request accepted", { variant: "success" });
				sliceDispatch(removeJoinGroupRequest(joinGroupRequestId));
			} else if (msg === "Fail to accept join group request") {
				enqueueSnackbar("Fail to accept join group request", {
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

	const handleReject = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch(
				`${serverURL}/join-group-request/reject-join-group-request`,
				{
					method: "DELETE",
					body: JSON.stringify({
						requestorId: joinGroupRequest.requestorId._id,
						groupId: groupId,
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

			const { msg, joinGroupRequestId } = await res.json();

			if (msg === "Success") {
				sliceDispatch(removeJoinGroupRequest(joinGroupRequestId));
				enqueueSnackbar("Join group request rejected", {
					variant: "success",
				});
			} else if (msg === "Fail to reject join group request") {
				enqueueSnackbar("Fail to rejct join group request", {
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

	const handleNavigate = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/group/join-request/${groupId}`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${joinGroupRequest.requestorId._id}`);
	};

	return (
		<div className="rounded-xl p-3 my-2 border border-gray-300 shadow-xl col-span-12 md:col-span-4 lg:col-span-3 grid grid-cols-12 grid-rows-2 md:flex md:flex-col items-center md:items-start gap-x-12">
			{loading && <Spinner />}
			{/* IMAGE */}
			<img
				src={profileImagePath}
				alt="Requestor profile image"
				className="col-span-2 row-span-3 border border-blue-400 rounded-full max-w-20 md:max-w-32 md:self-center"
			/>
			{/* USER NAME */}
			<div className="col-span-8 md:my-3 md:text-xl md:flex-1 flex">
				<p
					className="cursor-pointer hover:opacity-80 leading-none"
					onClick={handleNavigate}
				>
					{joinGroupRequest.requestorId.userName}
					{/* GENDER */}
					{joinGroupRequest.requestorId.userGender === "male" ? (
						<FaMale className="text-blue-500 inline" />
					) : (
						<FaFemale className="text-pink-500 inline" />
					)}
				</p>
			</div>

			{/* BUTTONS ROW */}
			<div className="col-span-8 md:flex md:w-full">
				{/* ACCEPT BUTTON */}
				<button
					className="btn-green mr-3 min-w-24 md:flex-1"
					onClick={handleAccept}
				>
					Accept
				</button>
				{/* REJECT BUTTON */}
				<button className="btn-red min-w-24 md:flex-1" onClick={handleReject}>
					Reject
				</button>
			</div>
		</div>
	);
};

export default JoinGroupRequest;
