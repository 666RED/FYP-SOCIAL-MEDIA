import React from "react";

const PrivacyPolicyElements = ({ privacyPolicy }) => {
	return (
		<div className={`${privacyPolicy.title !== "Contact Us" && "mb-3"}`}>
			{/* TITLE */}
			<h3 className="font-semibold text-base">{privacyPolicy.title}</h3>
			{/* TEXT */}
			<p className="text-sm md:text-base ">{privacyPolicy.text}</p>
		</div>
	);
};

export default PrivacyPolicyElements;
