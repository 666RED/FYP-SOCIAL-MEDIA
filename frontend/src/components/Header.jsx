import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ extendSideBar, setExtendSideBar, title }) => {
	return (
		// later change position attribute
		<div className="mb-2 pl-2 sticky top-0 bg-white z-20">
			<div className="flex items-center">
				<GiHamburgerMenu
					onClick={() => setExtendSideBar(!extendSideBar)}
					className="mr-3 icon"
				/>
				<h2>{title}</h2>
			</div>
		</div>
	);
};

export default Header;
