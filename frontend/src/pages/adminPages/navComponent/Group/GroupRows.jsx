import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import GroupRow from "./GroupRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { groupContext } from "./GroupPage.jsx";

const GroupRows = () => {
	const { currentGroups, loading, indexOfFirstGroup } =
		useContext(groupContext);

	return loading ? (
		<Loader />
	) : currentGroups.length > 0 ? (
		currentGroups.map((group, index) => (
			<GroupRow
				group={group}
				key={group._id}
				count={indexOfFirstGroup + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default GroupRows;
