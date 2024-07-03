import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import JoinGroupRequestsList from "./component/JoinGroupRequestsList.jsx";

const JoinRequestPage = () => {
	const { user, token } = useSelector((store) => store.auth);
	const { groupId } = useParams();

	return user && token ? (
		<div className="page-layout-with-back-arrow pb-2">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination={`/group/${groupId}`}
				title="Join group requests"
			/>
			{/* JOIN GROUP REQUESTS LIST */}
			<JoinGroupRequestsList />
		</div>
	) : (
		<Error />
	);
};

export default JoinRequestPage;
