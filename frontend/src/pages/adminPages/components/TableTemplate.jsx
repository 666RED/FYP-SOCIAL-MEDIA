import { React } from "react";

const TableTemplate = ({ head, body }) => {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border border-collapse border-slate-400 min-w-max">
				{/* HEAD */}
				{head}
				{/* BODY */}
				{body}
			</table>
		</div>
	);
};

export default TableTemplate;
