import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const FormBackArrowHeader = ({ destination, title, func = null }) => {
	const navigate = useNavigate();

	return (
		<div className="relative">
			<FaArrowLeft
				className="text-lg cursor-pointer hover:opacity-80 absolute top-1"
				onClick={() => {
					navigate(destination);
					if (func) {
						func();
					}
				}}
			/>
			<h2 className="ml-4 font-semibold text-center">{title}</h2>
		</div>
	);
};

export default FormBackArrowHeader;
