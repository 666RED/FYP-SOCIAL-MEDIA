import React from "react";
import { FaArrowLeft } from "react-icons/fa/index.js";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ destination }) => {
	const navigate = useNavigate();

	return (
		<div>
			<FaArrowLeft
				className="text-lg cursor-pointer hover:opacity-80"
				onClick={() => navigate(destination)}
			/>
		</div>
	);
};

export default BackArrow;
