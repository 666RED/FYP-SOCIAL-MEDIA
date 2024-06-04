import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MdCancel } from "react-icons/md";
import TopSideBarListElement from "./TopSideBarListelement.jsx";
import Filter from "../../../components/Filter.jsx";
import { logout } from "../../../features/adminSlice.js";

const TopSideBar = ({ setExtendSideBar, extendSideBar, selectedSection }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		<div>
			{extendSideBar && <Filter />}
			<div
				className={`z-30 bg-gray-700 fixed top-0 left-0 right-0 bottom-0 transform sidebar-transition overflow-hidden ${
					extendSideBar ? "h-screen" : "h-0"
				}`}
			>
				{/* LOGO & CLOSE BUTTON */}
				<div className="flex items-center justify-between px-1">
					<p className="indent-1">Logo</p>
					<MdCancel
						className="icon text-red-600 hover:text-red-500"
						onClick={() => setExtendSideBar(false)}
					/>
				</div>
				{/* LIST ELEMENTS */}
				<ul className="mt-3 text-white grid sidebar-list indent-1">
					{sideBarListElements.map((element, id) => {
						return (
							<TopSideBarListElement
								element={element}
								key={id}
								selectedSection={selectedSection}
							/>
						);
					})}
				</ul>
				{/* LOG OUT */}
				<p
					className="indent-1 absolute bottom-0 left-0 right-0  hover:bg-gray-500 px-1 py-3 rounded-md cursor-pointer text-white"
					onClick={() => {
						dispatch(logout());
						navigate("/admin");
					}}
				>
					Logout
				</p>
			</div>
		</div>
	);
};

export default TopSideBar;
