import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setExtendSideBar } from "../../pages/homepages/features/homepageSlice.js";

const SidebarListElement = ({ listElement, selectedSection, destination }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<li
			className={`${listElement === selectedSection && "bg-gray-400"}`}
			onClick={() => {
				dispatch(setExtendSideBar(false));
				navigate(destination);
			}}
		>
			{listElement}
		</li>
	);
};

export default SidebarListElement;
