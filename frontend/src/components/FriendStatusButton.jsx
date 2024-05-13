import { React } from "react";

const FriendStatusButton = ({ friendStatus, functions }) => {
	const {
		handleAddFriend,
		handleCancelRequest,
		toggleShowRespondForm,
		handleRemoveFriend,
	} = functions;

	switch (friendStatus) {
		case "Not friend": {
			return (
				<button
					className="btn-blue text-sm sm:text-base w-full"
					onClick={handleAddFriend}
				>
					Add Friend
				</button>
			);
		}
		case "Pending": {
			return (
				<button
					className="btn-yellow text-sm sm:text-base w-full"
					onClick={handleCancelRequest}
				>
					Pending
				</button>
			);
		}
		case "Confirm": {
			return (
				<button
					className="btn-blue text-sm sm:text-base w-full"
					onClick={toggleShowRespondForm}
				>
					Respond
				</button>
			);
		}
		case "Friend": {
			return (
				<button
					className="btn-red text-sm sm:text-base w-full"
					onClick={handleRemoveFriend}
				>
					Unfriend
				</button>
			);
		}
		default: {
		}
	}
};

export default FriendStatusButton;
