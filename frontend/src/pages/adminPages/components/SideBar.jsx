import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SideBarListElement from "./SideBarListElement.jsx";
import { logout } from "../../../features/adminSlice.js";

const SideBar = ({ selectedSection }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const sideBarListElements = [
		{
			component: "Dashboard",
			action: () => {
				navigate("/admin/dashboard");
			},
		},
		{
			component: "User",
			action: () => {
				navigate("/admin/user");
			},
		},
		{
			component: "Group",
			action: () => {
				navigate("/admin/group");
			},
		},
		{
			component: "Campus Condition",
			action: () => {
				navigate("/admin/condition");
			},
		},
		{
			component: "Product",
			action: () => {
				navigate("/admin/product");
			},
		},
		{
			component: "Service",
			action: () => {
				navigate("/admin/service");
			},
		},
		{
			component: "Event",
			action: () => {
				navigate("/admin/event");
			},
		},
		{
			component: "Report",
			action: () => {
				navigate("/admin/report");
			},
		},
	];

	return (
		<div className="hidden lg:block col-span-2 relative h-screen border-e-2 bg-gray-700 text-white">
			{/* LOGO */}
			<div className="flex items-center justify-between">
				<img src="/sidebar-logo.png" alt="Logo" className="w-32 mt-1 ml-1" />
			</div>
			{/* LIST ELEMENTS */}
			<ul className="indent-1 mt-3 grid">
				{sideBarListElements.map((element, id) => {
					return (
						<SideBarListElement
							element={element}
							key={id}
							selectedSection={selectedSection}
						/>
					);
				})}
			</ul>
			{/* LOG OUT */}
			<p
				className="indent-1 absolute bottom-0 left-0 right-0  hover:bg-gray-500 px-1 py-3 rounded-md cursor-pointer"
				onClick={() => {
					dispatch(logout());
					navigate("/admin");
				}}
			>
				Logout
			</p>
		</div>
	);
};

export default SideBar;
