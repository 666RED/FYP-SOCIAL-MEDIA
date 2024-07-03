import React from "react";
import BackArrow from "./BackArrow.jsx";

const BackArrowHeader = ({ makeChanges = false, title = "" }) => {
	return (
		<div className="header-design flex items-center">
			<BackArrow discardChanges={makeChanges} />
			<h2 className="ml-4 font-semibold">{title}</h2>
		</div>
	);
};

export default BackArrowHeader;
