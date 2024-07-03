import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ extendSideBar, setExtendSideBar, title }) => {
	return (
		<div className="header-design">
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
