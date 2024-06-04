import React from "react";

const ConditionHead = () => {
	return (
		<thead>
			<tr>
				<th className="font-semibold">#</th>
				<th className="font-semibold text-left">Title</th>
				<th className="font-semibold text-left">Description</th>
				<th className="font-semibold">Image</th>
				<th className="font-semibold text-left">Poster</th>
				<th className="text-center font-semibold">Resolved</th>
				<th className="font-semibold">Uploaded</th>
				<th className="font-semibold">Status</th>
				<th className="font-semibold">Operation</th>
			</tr>
		</thead>
	);
};

export default ConditionHead;
