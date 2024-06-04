import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ extendSideBar, setExtendSideBar }) => {
	return (
		<div className="pt-2 sticky top-0 bg-white z-20">
			<div className="flex items-center justify-center">
				<GiHamburgerMenu
					onClick={() => setExtendSideBar(!extendSideBar)}
					className="mr-3 icon"
				/>
			</div>
		</div>
	);
};

export default Header;
