import { React, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaFemale, FaMale } from "react-icons/fa";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import {
	removeMember,
	setMembersArr,
	setNumberOfMembers,
} from "../../../../../features/groupMemberSlice.js";
import { ServerContext } from "../../../../../App.js";

const Member = ({ member }) => {
	const { groupId, groupAdminId } = useParams();
	const navigate = useNavigate();
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const filePath = `${serverURL}/public/images/profile/`;

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/group/view-members/${groupId}/${groupAdminId}`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${member._id}`);
	};

	const handleRemove = async (e) => {
		e.preventDefault();
		try {
			const ans = window.confirm("Remove member?");
			if (ans) {
				setLoading(true);
				const res = await fetch(`${serverURL}/group/remove-member`, {
					method: "PATCH",
					body: JSON.stringify({ userId: member._id, groupId: groupId }),
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

				const { msg, userId, numberOfMembers } = await res.json();

				if (msg === "Success") {
					sliceDispatch(removeMember(userId));
					sliceDispatch(setNumberOfMembers(numberOfMembers));
					enqueueSnackbar("Member removed", {
						variant: "success",
					});
				} else if (msg === "Fail to remove member") {
					enqueueSnackbar("Fail to remove member", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<div className="rounded-xl p-3 my-4 border border-gray-300 flex items-center justify-between shadow-xl">
			{loading && <Spinner />}
			<div className="flex items-center">
				{/* PROFILE IMAGE */}
				<img
					src={`${filePath}${member.profileImagePath}`}
					alt="Member profile image"
					className={`w-14 md:w-16 border-[2.5px] ${member.frameColor} rounded-full`}
				/>
				<div className="ml-3 text-sm md:text-base">
					{/* USER NAME AND GENDER*/}
					<p
						onClick={handleOnClick}
						className="cursor-pointer hover:opacity-80 leading-none"
					>
						{member.userName}
						{member.userGender === "male" ? (
							<FaMale className="text-blue-500 inline" />
						) : (
							<FaFemale className="text-pink-500 inline" />
						)}
					</p>
				</div>
			</div>
			{/* REMOVE MEMBER BUTTON */}
			{user._id === groupAdminId && member._id !== groupAdminId && (
				<button className="btn-red text-sm md:text-base" onClick={handleRemove}>
					Remove
				</button>
			)}
			{/* GROUP ADMIN TEXT */}
			{member._id === groupAdminId && (
				<p className="text-blue-400 mr-2">Group admin</p>
			)}
		</div>
	);
};

export default Member;
