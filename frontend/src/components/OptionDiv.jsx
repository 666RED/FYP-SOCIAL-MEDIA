import React from "react";

const OptionDiv = ({ icon, text, func }) => {
	return (
		<div
			className="flex items-center p-1 cursor-pointer hover:bg-gray-400"
			onClick={() => func()}
		>
			<div className="text-lg ">{icon}</div>
			<p className="ml-2 text-sm md:text-base">{text}</p>
		</div>
	);
};

export default OptionDiv;
