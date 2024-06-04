import React from "react";

const Section = ({ section }) => {
	return (
		<div
			className="col-span-6 md:col-span-4 lg:col-span-3 bg-gray-200 p-2 rounded-xl hover:opacity-70 cursor-pointer"
			onClick={section.action}
		>
			{/* TITLE */}
			<div className="font-semibold flex items-center justify-center">
				<p className="text-xl">{section.icon}</p>
				<h2 className="ml-2">
					{section.title[0].toUpperCase() + section.title.slice(1)}
				</h2>
			</div>
			{/* INFORMATION */}
			<div className="flex items-center mt-4">
				<div className="flex-1 flex flex-col items-center">
					<h2 className="font-semibold">{section.total}</h2>
				</div>
			</div>
		</div>
	);
};

export default Section;
