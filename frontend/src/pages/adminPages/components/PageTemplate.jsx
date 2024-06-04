import { React, useState, useEffect } from "react";
import Header from "./Header.jsx";
import SideBar from "./SideBar.jsx";
import Error from "./Error.jsx";
import TopSideBar from "./TopSideBar.jsx";
import { useSelector } from "react-redux";

const PageTemplate = ({ component, selectedSection }) => {
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const { user, token } = useSelector((store) => store.admin);

	// tracking window width
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// adjust extendSideBar
	useEffect(() => {
		if (windowWidth > 1024) {
			setExtendSideBar(false);
		}
	}, [windowWidth]);

	return user && token ? (
		<div className="">
			{/* HEADER */}
			<div className="block lg:hidden sticky top-0">
				<Header
					extendSideBar={extendSideBar}
					setExtendSideBar={setExtendSideBar}
				/>
			</div>

			{/* TOP SIDE BAR */}
			<TopSideBar
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				selectedSection={selectedSection}
			/>

			{/* MAIN CONTENT */}
			<div className="grid grid-cols-12">
				{/* LEFT SIDE BAR */}
				<SideBar selectedSection={selectedSection} />
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
