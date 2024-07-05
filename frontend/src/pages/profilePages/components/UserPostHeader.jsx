import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";

const UserPostHeader = ({
	imgPath,
	userName,
	postTime,
	isPost = true,
	conditionResolved = false,
	destination = "",
	previous = "",
	frameColor,
	groupName = "",
	groupImagePath = "",
	isGroup = false,
}) => {
	const navigate = useNavigate();

	const handleNavigate = () => {
		if (destination === previous) {
			return;
		}
		const previousArr = JSON.parse(localStorage.getItem("previous"));
		previousArr.push(previous);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(destination);
	};

	return (
		<div className="flex items-center">
			{/* PROFILE IMAGE */}
			{isGroup ? (
				<div className="relative">
					<img
						src={groupImagePath}
						alt="Group image"
						className={`rounded-full md:w-14 w-12 md:h-14 h-12 object-cover mr-2`}
					/>
					<img
						src={imgPath}
						alt="Profile image"
						className={`rounded-full mr-2 border-[2.5px] absolute ${frameColor} md:w-9 w-7 md:h-9 h-7 object-cover -right-1 top-6 bg-gray-200
						`}
					/>
				</div>
			) : (
				<img
					src={imgPath}
					alt="Profile image"
					className={`rounded-full mr-2 border-[2.5px] object-cover ${frameColor} ${
						isPost ? "md:w-14 w-12 md:h-14 h-12" : "md:w-12 w-8 md:h-12 h-8"
					}`}
				/>
			)}

			<div>
				{isGroup && (
					<p className={`${!isPost && "text-sm md:text-base"} font-semibold`}>
						{groupName}
					</p>
				)}
				{/* USER NAME */}
				<p
					className={`cursor-pointer hover:opacity-80 ${
						!isPost && "text-sm md:text-base"
					}`}
					onClick={handleNavigate}
				>
					{userName}
				</p>
				<div className="flex items-center">
					{/* POST TIME */}
					<p
						className={`text-gray-600 text-xs ${
							!isPost && "text-xs md:text-sm"
						}`}
					>
						{postTime}
					</p>
					{/* RESOLVED TEXT */}
					{conditionResolved && (
						<div className="inline-flex items-center ml-2 text-sm">
							<IoIosCheckmarkCircle className="text-green-500" />
							<span className="text-green-500">Resolved</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserPostHeader;
