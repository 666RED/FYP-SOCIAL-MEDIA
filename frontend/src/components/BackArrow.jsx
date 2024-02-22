import React from "react";
import { FaArrowLeft } from "react-icons/fa/index.js";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ destination, discardChanges = false }) => {
	const navigate = useNavigate();

	return (
		<div>
			<FaArrowLeft
				className="text-lg cursor-pointer hover:opacity-80"
				onClick={() => {
					if (!discardChanges) {
						navigate(destination);
						return;
					}
					// maybe change later
					const answer = window.confirm("Discard changes?");
					if (answer) {
						navigate(destination);
					}
				}}
			/>
		</div>
	);
};

export default BackArrow;
