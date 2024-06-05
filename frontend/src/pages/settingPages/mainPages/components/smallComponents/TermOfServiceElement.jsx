import React from "react";

const TermOfServiceElement = ({ termOfService }) => {
	return (
		<div className={`${termOfService.title !== "Contact Us" && "mb-3"}`}>
			{/* TITLE */}
			<h3 className="font-semibold text-base">{termOfService.title}</h3>
			{/* TEXT */}
			<p className="text-sm md:text-base ">{termOfService.text}</p>
		</div>
	);
};

export default TermOfServiceElement;
