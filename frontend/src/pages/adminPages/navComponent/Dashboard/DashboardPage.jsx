import React from "react";
import Sections from "./Sections.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";

const DashboardPage = ({ setCurrentNav }) => {
	return (
		<PageTemplate
			component={
				<div>
					{/* TITLE */}
					<h1 className="font-semibold mb-5">Dashboard</h1>
					{/* SECTIONS */}
					<Sections setCurrentNav={setCurrentNav} />
				</div>
			}
			selectedSection="Dashboard"
		/>
	);
};

export default DashboardPage;
