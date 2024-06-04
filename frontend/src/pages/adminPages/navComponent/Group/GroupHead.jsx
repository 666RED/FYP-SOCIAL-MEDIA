import React from "react";

const GroupHead = () => {
	return (
		<thead>
			<tr>
				<th className="font-semibold">#</th>
				<th className="font-semibold text-left">Name</th>
				<th className="font-semibold">Group image</th>
				<th className="font-semibold">Cover image</th>
				<th className="font-semibold text-left">Group admin</th>
				<th className="font-semibold">Posts</th>
				<th className="font-semibold">Members</th>
				<th className="font-semibold">Created</th>
				<th className="font-semibold">Status</th>
			</tr>
		</thead>
	);
};

export default GroupHead;
