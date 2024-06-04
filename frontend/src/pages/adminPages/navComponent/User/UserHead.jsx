import React from "react";

const UserHead = () => {
	return (
		<thead>
			<tr>
				<th className="text-center font-semibold">#</th>
				<th className="font-semibold text-left">Name</th>
				<th className="font-semibold">Profile Image</th>
				<th className="font-semibold">Cover Image</th>
				<th className="font-semibold text-left">Email</th>
				<th className="font-semibold text-left">Phone Number</th>
				<th className="text-center font-semibold">Friends</th>
				<th className="text-center font-semibold">Groups</th>
				<th className="text-center font-semibold">Registered</th>
			</tr>
		</thead>
	);
};

export default UserHead;
