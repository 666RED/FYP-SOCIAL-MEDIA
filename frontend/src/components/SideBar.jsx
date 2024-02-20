import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md/index.js";
import { setExtendSideBar } from "../pages/homepages/features/homepage.js";

const SideBar = () => {
	const dispatch = useDispatch();
	const { extendSideBar } = useSelector((store) => store.homepage);

	// later add transition
	return (
		<div className="w-44 sm:w-52 bg-gray-700 fixed top-0 left-0 bottom-0 p-2 transofrm">
			<div className="flex items-center justify-between">
				<p>Logo</p>
				<MdCancel
					className="icon text-red-600 hover:text-red-500"
					onClick={() => dispatch(setExtendSideBar(false))}
				/>
			</div>
			<ul className="mt-4 text-white grid sidebar-list">
				<li>Home</li>
				<li>Profile</li>
				<li>Group</li>
				<li>Campus Condition</li>
				<li>Friend</li>
				<li>MarketPlace</li>
				<li>Setting</li>
			</ul>
			<p className="absolute bottom-0 w-11/12 hover:bg-gray-400 px-1 py-3 rounded-md cursor-pointer text-white">
				Logout
			</p>
		</div>
	);
};

export default SideBar;
