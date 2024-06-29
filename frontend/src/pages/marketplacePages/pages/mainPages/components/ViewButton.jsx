import React from "react";
import { useNavigate } from "react-router-dom";

const ViewButton = ({ path }) => {
	const navigate = useNavigate();

	return (
		<button
			className="text-sm sm:text-base btn-gray mt-2"
			onClick={() => navigate(path)}
		>
			View
		</button>
	);
};

export default ViewButton;
