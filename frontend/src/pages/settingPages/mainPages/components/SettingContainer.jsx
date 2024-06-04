import React from "react";
import Setting from "./Setting.jsx";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const SettingContainer = ({
	expandList,
	setExpandList,
	list,
	title,
	maxHeight,
}) => {
	return (
		<div className="border border-gray-400 rounded-lg overflow-hidden pb-1 bg-white">
			{/* CONTAINER */}
			<div
				className="flex items-center justify-between cursor-pointer p-2"
				onClick={() => setExpandList((prev) => !prev)}
			>
				{/* TITLE */}
				<p>{title}</p>
				{/* ICONS */}
				{expandList ? (
					<MdExpandLess className="text-lg" />
				) : (
					<MdExpandMore className="text-lg" />
				)}
			</div>
			{/* LIST ITEMS */}
			<ul
				className={`setting-transition overflow-hidden ${
					expandList ? maxHeight : "max-h-0"
				} `}
			>
				{list.map((setting) => (
					<Setting title={setting.title} key={setting.id} func={setting.func} />
				))}
			</ul>
		</div>
	);
};

export default SettingContainer;
