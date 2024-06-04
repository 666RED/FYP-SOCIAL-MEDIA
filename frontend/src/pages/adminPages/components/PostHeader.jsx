import React from "react";

const PostHeader = ({ imagePath, userName, time }) => {
	return (
		<div className="flex items-center">
			{/* PROFILE IAMGE */}
			<img
				src={imagePath}
				alt="Profile image"
				className={`rounded-full mr-2 border-[2.5px] md:w-14 w-12`}
			/>
			<div>
				{/* USER NAME */}
				<p>{userName}</p>
				<div className="flex-items-center">
					{/* POST TIME */}
					<p className="text-gray-600 text-xs">{time}</p>
				</div>
			</div>
		</div>
	);
};

export default PostHeader;
