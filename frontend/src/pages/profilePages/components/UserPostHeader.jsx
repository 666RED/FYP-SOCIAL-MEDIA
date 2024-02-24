import React from "react";

const UserPostHeader = ({ imgPath, userName, postTime }) => {
	return (
		<div className="flex items-center">
			<img
				src={imgPath}
				alt="Profile image"
				className="rounded-full mr-2 border border-blue-400 md:w-16 w-12"
			/>
			<div>
				<p>{userName}</p>
				<p className="text-gray-600 text-xs">{postTime}</p>
			</div>
		</div>
	);
};

export default UserPostHeader;
