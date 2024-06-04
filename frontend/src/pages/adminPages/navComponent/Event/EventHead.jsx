import React from "react";

const EventHead = () => {
	return (
		<thead>
			<tr>
				<th className="font-semibold">#</th>
				<th className="font-semibold text-left">Name</th>
				<th className="font-semibold text-left">Description</th>
				<th className="font-semibold">Image</th>
				<th className="font-semibold text-left">Poster</th>
				<th className="font-semibold text-left">Orgnizer</th>
				<th className="font-semibold text-left">Venue</th>
				<th className="font-semibold text-left">Contact numbers</th>
				<th className="font-semibold">Uploaded</th>
				<th className="font-semibold">Status</th>
			</tr>
		</thead>
	);
};

export default EventHead;
