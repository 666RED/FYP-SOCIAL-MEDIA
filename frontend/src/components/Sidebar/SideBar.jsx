import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MdCancel } from "react-icons/md/index.js";
import SidebarListElement from "./SidebarListElement.jsx";
import { logout } from "../../features/authSlice.js";
import Filter from "../Filter.jsx";

const SideBar = ({ selectedSection, setExtendSideBar, extendSideBar }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);

	const sidebarListElements = [
		{ page: "Home", destination: "/home" },
		{ page: "Profile", destination: `/profile/${user._id}` },
		{ page: "Group", destination: "/group" },
		{ page: "Campus Condition", destination: "/campus-condition" },
		{ page: "Friend", destination: "/friend" },
		{ page: "MarketPlace", destination: "/marketplace" },
		{ page: "Setting", destination: "/setting" },
	];

	return (
		<div>
			{extendSideBar && <Filter />}
			<div
				className={`${
					extendSideBar ? "w-44 sm:w-52 p-2" : "w-0"
				} bg-gray-700 fixed top-0 left-0 bottom-0 transform z-30 sidebar-transition overflow-hidden`}
			>
				{/* LOGO & CLOSE BUTTON */}
				<div className="flex items-center justify-between">
					<p>Logo</p>
					<MdCancel
						className="icon text-red-600 hover:text-red-500"
						onClick={() => setExtendSideBar(false)}
					/>
				</div>
				{/* LIST ELEMENTS */}
				<ul className={`mt-4 text-white grid sidebar-list sidebar-transition`}>
					{sidebarListElements.map(({ page, destination }, id) => {
						return (
							<SidebarListElement
								selectedSection={selectedSection}
								listElement={page}
								destination={destination}
								key={id}
							/>
						);
					})}
				</ul>
				{/* LOG OUT */}
				<p
					className="absolute bottom-0 w-11/12 hover:bg-gray-500 px-1 py-3 rounded-md cursor-pointer text-white"
					onClick={() => {
						dispatch(logout());
						navigate("/");
					}}
				>
					Logout
				</p>
			</div>
		</div>
	);
};

export default SideBar;
