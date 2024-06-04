import React from "react";

const SideBarListelement = ({ element, selectedSection }) => {
	return (
		<li
			className={`${
				selectedSection == element.component && "bg-gray-400 text-white"
			} w-full px-1 py-3 rounded-md cursor-pointer hover:bg-gray-500`}
			onClick={element.action}
		>
			{element.component}
		</li>
	);
};

export default SideBarListelement;
