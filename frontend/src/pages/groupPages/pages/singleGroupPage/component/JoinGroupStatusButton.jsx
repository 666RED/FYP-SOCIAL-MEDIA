import React from "react";

const JoinGroupStatusButton = ({ joinGroupStatus, functions }) => {
	const { handleJoinGroup, handleLeaveGroup, handleCancelRequest } = functions;

	switch (joinGroupStatus) {
		case "Not join": {
			return (
				<button
					className="btn-blue my-2 text-sm sm:text-base w-full"
					onClick={handleJoinGroup}
				>
					Join Group
				</button>
			);
		}
		case "Pending": {
			return (
				<button
					className="btn-yellow my-2 text-sm sm:text-base w-full"
					onClick={handleCancelRequest}
				>
					Pending
				</button>
			);
		}
		case "Accepted": {
			return (
				<button
					className="btn-red my-2 text-sm sm:text-base w-full"
					onClick={handleLeaveGroup}
				>
					Leave Group
				</button>
			);
		}
	}
};

export default JoinGroupStatusButton;
