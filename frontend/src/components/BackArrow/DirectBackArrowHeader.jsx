import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const DirectBackArrowHeader = ({ destination, title }) => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center">
			<div>
				<FaArrowLeft
					className="text-lg cursor-pointer hover:opacity-80"
					onClick={() => {
						navigate(destination);
					}}
				/>
			</div>
			<h2 className="ml-4 font-semibold">{title}</h2>
		</div>
	);
};

export default DirectBackArrowHeader;
