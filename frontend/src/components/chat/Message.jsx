import React from "react";
import { useSelector } from "react-redux";
import { formatTimeForFirebaseDoc } from "../../usefulFunction.js";

const Message = ({ currentMessage, imagePath, lastElement }) => {
	const { user } = useSelector((store) => store.auth);
	const isUser = user._id === currentMessage.sender;

	const reg_ex = /(https?:\/\/[^\s]+)/gi;

	return (
		<div className={`${!lastElement ? "mb-6" : "mb-2"}`}>
			<div className={`flex ${isUser && "flex-row-reverse"}`}>
				{/* PROFILE IMAGE */}
				<img
					src={isUser ? user.userProfile.profileImagePath : imagePath}
					alt="User profile image"
					className="rounded-full w-10 h-10 object-cover self-end"
				/>
				{/* MESSAGE */}
				<div
					className={`rounded-t-2xl ${
						isUser ? "rounded-bl-2xl" : "rounded-br-2xl"
					} pt-2 pb-1 pl-3 pr-2 max-w-[70%] bg-white mx-2 flex`}
				>
					{reg_ex.test(currentMessage.message) ? (
						// HYPERLINK
						<a
							href={currentMessage.message}
							className="text-blue-700 hover:text-blue-600 mb-2"
							target="_blank"
						>
							{currentMessage.message}
						</a>
					) : (
						// NORMAL TEXT
						<p className="mb-2">{currentMessage.message}</p>
					)}
					{/* TIME */}
					<span className="text-xs text-gray-700 self-end ml-3">
						{formatTimeForFirebaseDoc(currentMessage.createdAt)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Message;
