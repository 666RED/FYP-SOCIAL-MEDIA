import { React, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFemale, FaMale } from "react-icons/fa";
import { ServerContext } from "../../../App.js";

const Friend = ({ friend }) => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/profile/view-friends/${userId}`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${friend._id}`);
	};

	return (
		<div
			className="rounded-xl p-3 my-4 border border-gray-300 flex items-center justify-between cursor-pointer hover:bg-gray-200"
			onClick={handleOnClick}
		>
			<div className="flex items-center">
				{/* PROFILE IMAGE */}
				<img
					src={friend.userProfile.profileImagePath}
					alt="Friend profile image"
					className={`w-10 border-[2.5px] ${friend.userProfile.profileFrameColor} rounded-full`}
				/>
				<div className="ml-3 text-sm md:text-base">
					<div className="flex items-center">
						{/* USER NAME */}
						<p>{friend.userName}</p>
						{/* GENDER */}
						<p>
							{friend.userGender === "male" ? (
								<FaMale className="text-blue-500" />
							) : (
								<FaFemale className="text-pink-500" />
							)}
						</p>
					</div>
					{/* FRIENDS AMOUNT */}
					<p>
						{Object.keys(friend.userFriendsMap).length}{" "}
						{Object.keys(friend.userFriendsMap).length > 1
							? "friends"
							: "friend"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Friend;
