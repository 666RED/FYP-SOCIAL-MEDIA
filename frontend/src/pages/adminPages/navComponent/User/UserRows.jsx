import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import UserRow from "./UserRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { userContext } from "./UserPage.jsx";

const UserRows = () => {
	const { loading, currentUsers, indexOfFirstUser } = useContext(userContext);

	return loading ? (
		<Loader />
	) : currentUsers.length > 0 ? (
		currentUsers.map((user, index) => (
			<UserRow
				user={user}
				key={user._id}
				count={indexOfFirstUser + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default UserRows;
