import React from "react";

const StatusText = ({ isRemoved }) => {
	return (
		<td
			className={`text-center ${isRemoved ? "text-red-600" : "text-green-600"}`}
		>
			{isRemoved ? "Removed" : "Available"}
		</td>
	);
};

export default StatusText;
