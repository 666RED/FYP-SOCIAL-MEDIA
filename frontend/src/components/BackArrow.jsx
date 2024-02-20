import React from "react";
import { FaArrowLeft } from "react-icons/fa/index.js";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ destination = "/home" }) => {
	const navigate = useNavigate();

	return (
		<div>
			<FaArrowLeft
				className="fs-3"
				style={{ cursor: "pointer" }}
				onClick={() => navigate(destination)}
			/>
		</div>
	);
};

export default BackArrow;
