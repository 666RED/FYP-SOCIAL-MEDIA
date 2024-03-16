import React from "react";
import { useSelector } from "react-redux";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import FriendRequestsList from "./component/FriendRequestsList.jsx";

const FriendRequestPage = () => {
	const { user, token } = useSelector((store) => store.auth);

	return user && token ? (
		<div className="page-layout-with-back-arrow">
			{/* HEADER */}
			<DirectBackArrowHeader destination="/friend" title="Friend request" />
			{/* FRIEND REQUESTS LIST */}
			<FriendRequestsList />
		</div>
	) : (
		<Error />
	);
};

export default FriendRequestPage;
