import { React, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdCancel } from "react-icons/md";
import Filter from "../../../components/Filter.jsx";
import SideBarListElement from "./SideBarListElement.jsx";
import { logout } from "../../../features/adminSlice.js";

const SideBar = ({ selectedSection, setExtendSideBar, extendSideBar }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const sidebarRef = useRef();

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

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setExtendSideBar(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setExtendSideBar]);

	return (
		<div>
			{extendSideBar && <Filter />}
			<div
				className={`${
					extendSideBar ? "w-44 sm:w-52" : "w-0"
				} bg-gray-700 fixed top-0 left-0 bottom-0 transform z-30 sidebar-transition pt-1 overflow-hidden`}
				ref={sidebarRef}
			>
				{/* LOGO */}
				<div className="flex items-center justify-between pt-1 pl-1">
					<img src="/sidebar-logo.png" alt="Logo" className="w-24 sm:w-32" />
					<MdCancel
						className="icon text-red-600 hover:text-red-500"
						onClick={() => setExtendSideBar(false)}
					/>
				</div>
				{/* LIST ELEMENTS */}
				<ul className="mt-4 text-white grid sidebar-list">
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
					className="absolute bottom-0 w-full hover:bg-gray-500 px-1 py-3 rounded-md cursor-pointer text-white"
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

export default SideBar;
