import React from "react";

const TopSideBarListelement = ({ element, selectedSection }) => {
	return (
		<li
			className={`${
				selectedSection === element.component && "bg-gray-400"
			} text-nowrap`}
			onClick={element.action}
		>
			{element.component}
		</li>
	);
};

export default TopSideBarListelement;
