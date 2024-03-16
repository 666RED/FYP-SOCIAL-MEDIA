import React from "react";
import { useSelector } from "react-redux";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import PendingList from "./component/PendingList.jsx";

const PendingPage = () => {
	const { user, token } = useSelector((store) => store.auth);

	return user && token ? (
		<div className="page-layout-with-back-arrow">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination="/friend"
				title="Pending friend request"
			/>
			{/* PENDING LIST */}
			<PendingList />
		</div>
	) : (
		<Error />
	);
};

export default PendingPage;
