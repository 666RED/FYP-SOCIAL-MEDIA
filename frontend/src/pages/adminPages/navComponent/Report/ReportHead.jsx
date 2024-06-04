import React from "react";

const ReportHead = () => {
	return (
		<thead>
			<tr>
				<th className="font-semibold">#</th>
				<th className="font-semibold text-left">Reporter</th>
				<th className="font-semibold text-left">Target Id</th>
				<th className="font-semibold text-left">Type</th>
				<th className="font-semibold text-left">Reason</th>
				<th className="font-semibold text-left">Reported</th>
				<th className="font-semibold">Status</th>
				<th className="font-semibold">Operation</th>
			</tr>
		</thead>
	);
};

export default ReportHead;
