import React from "react";

const UserPostHeader = ({ imgPath, userName, postTime, isPost = true }) => {
	return (
		<div className="flex items-center">
			<img
				src={imgPath}
				alt="Profile image"
				className={`rounded-full mr-2 border border-blue-400  ${
					isPost ? "md:w-16 w-12" : "md:w-12 w-8"
				}`}
			/>
			<div>
				<p className={`${!isPost && "text-sm md:text-base"}`}>{userName}</p>
				<p
					className={`text-gray-600 text-xs ${!isPost && "text-xs md:text-sm"}`}
				>
					{postTime}
				</p>
			</div>
		</div>
	);
};

export default UserPostHeader;
