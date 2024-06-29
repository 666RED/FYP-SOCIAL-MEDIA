import React from "react";
import { useNavigate } from "react-router-dom";

const EditButton = ({ path }) => {
	const navigate = useNavigate();

	return (
		<button
			className="text-sm sm:text-base btn-green mt-2"
			onClick={() => navigate(path)}
		>
			Edit
		</button>
	);
};

export default EditButton;
