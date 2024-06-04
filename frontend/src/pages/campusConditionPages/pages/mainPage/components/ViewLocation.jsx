import React from "react";
import { FaArrowLeft } from "react-icons/fa/index.js";
import Places from "../../uploadPage/components/Places.jsx";

const ViewLocation = ({ toggleViewLocation }) => {
	return (
		<div className="center-container items-center px-5 md:px-32 bg-black bg-opacity-75">
			<div className="w-full">
				<FaArrowLeft
					className="cursor-pointer text-white text-2xl"
					onClick={toggleViewLocation}
				/>
				<Places />
			</div>
		</div>
	);
};

export default ViewLocation;
