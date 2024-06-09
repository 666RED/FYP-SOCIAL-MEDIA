import { React, useState } from "react";
import Header from "./Header.jsx";
import SideBar from "./SideBar.jsx";
import Error from "./Error.jsx";
import { useSelector } from "react-redux";

const PageTemplate = ({ component, selectedSection }) => {
	const [extendSideBar, setExtendSideBar] = useState(false);
	const { user, token } = useSelector((store) => store.admin);

	return user && token ? (
		<div className="">
			{/* HEADER */}
			<div className="block sticky top-0">
				<Header
					extendSideBar={extendSideBar}
					setExtendSideBar={setExtendSideBar}
				/>
			</div>
			{/* MAIN CONTENT */}
			<div className="grid grid-cols-12">
				{/* LEFT SIDE BAR */}
				<SideBar
					selectedSection={selectedSection}
					extendSideBar={extendSideBar}
					setExtendSideBar={setExtendSideBar}
				/>
				{/* TABLE (RIGHT HAND SIDE) */}
				<div className="lg:col-span-10 col-span-12 px-2 lg:mt-5">
					{/* COMPONENETS */}
					{component}
				</div>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default PageTemplate;
