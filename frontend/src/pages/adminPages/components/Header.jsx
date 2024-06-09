import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ extendSideBar, setExtendSideBar }) => {
	return (
		<div className="mb-2 pl-2 pt-3 sticky top-0 bg-white z-20">
			<div className="flex items-center">
				<GiHamburgerMenu
					onClick={() => setExtendSideBar(!extendSideBar)}
					className="mr-3 icon"
				/>
			</div>
		</div>
	);
};

export default Header;
