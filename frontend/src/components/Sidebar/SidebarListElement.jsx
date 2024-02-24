import React from "react";
import { useNavigate } from "react-router";

const SidebarListElement = ({ listElement, selectedSection, destination }) => {
	const navigate = useNavigate();
	return (
		<li
			className={`${listElement === selectedSection && "bg-gray-400"}`}
			onClick={() => {
				navigate(destination);
			}}
		>
			{listElement}
		</li>
	);
};

export default SidebarListElement;
