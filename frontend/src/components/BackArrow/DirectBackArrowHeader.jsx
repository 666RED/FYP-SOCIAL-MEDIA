import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const DirectBackArrowHeader = ({
	destination,
	title,
	discardChanges = false,
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center">
			<FaArrowLeft
				className="text-lg cursor-pointer hover:opacity-80"
				onClick={() => {
					if (!discardChanges) {
						navigate(destination);
					} else {
						const ans = window.confirm("Discard changes?");
						if (ans) {
							navigate(destination);
						}
					}
				}}
			/>
			<h2 className="ml-4 font-semibold">{title}</h2>
		</div>
	);
};

export default DirectBackArrowHeader;
