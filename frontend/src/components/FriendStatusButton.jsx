import { React } from "react";
import { MdReply, MdPending } from "react-icons/md";
import { IoMdPersonAdd, IoMdRemoveCircle } from "react-icons/io";

const FriendStatusButton = ({ friendStatus, functions, needsIcon = true }) => {
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
					className="btn-blue profile-btn w-full"
					onClick={handleAddFriend}
				>
					{needsIcon && <IoMdPersonAdd className="profile-btn-icon" />} Add
					Friend
				</button>
			);
		}
		case "Pending": {
			return (
				<button
					className="btn-yellow profile-btn w-full"
					onClick={handleCancelRequest}
				>
					{needsIcon && <MdPending className="profile-btn-icon" />}
					Pending
				</button>
			);
		}
		case "Confirm": {
			return (
				<button
					className="btn-blue profile-btn w-full"
					onClick={toggleShowRespondForm}
				>
					{needsIcon && <MdReply className="profile-btn-icon" />}
					Respond
				</button>
			);
		}
		case "Friend": {
			return (
				<button
					className="btn-red profile-btn w-full"
					onClick={handleRemoveFriend}
				>
					{needsIcon && <IoMdRemoveCircle className="profile-btn-icon" />}
					Unfriend
				</button>
			);
		}
		default: {
		}
	}
};

export default FriendStatusButton;
