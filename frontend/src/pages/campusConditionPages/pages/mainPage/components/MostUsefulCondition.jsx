import React from "react";
import { useNavigate } from "react-router-dom";
import { HiThumbUp } from "react-icons/hi";
import { IoIosCheckmarkCircle } from "react-icons/io";

const MostUsefulCondition = ({ condition }) => {
	const navigate = useNavigate();
	const duration = Math.floor(condition.duration);
	const uploadDuration = duration === 0 ? "within 1h" : duration + "h";
	const conditionId = condition._id;

	return (
		<div
			className="cursor-pointer hover:bg-gray-300 py-1 px-2 rounded-xl bg-gray-200 mb-2"
			onClick={() =>
				navigate(`/campus-condition/view-most-useful-condition/${conditionId}`)
			}
		>
			{/* TITLE */}
			<div className="flex items-center">
				<p className="font-semibold leading-5 text-lg">
					{condition.conditionTitle}
				</p>
				{condition.conditionResolved && (
					<div className="inline-flex items-center ml-2 text-sm">
						<IoIosCheckmarkCircle className="text-green-500" />
						<span className="text-green-500">Resolved</span>
					</div>
				)}
			</div>
			{/* UP */}
			<div className="flex items-center mt-1">
				<HiThumbUp />
				<p className="ml-1">{`${condition.conditionUp}`}</p>
			</div>
			{/* UPLOAD TIME */}
			<p className="">{`Uploaded ${uploadDuration} ${
				duration !== 0 ? "ago" : ""
			}`}</p>
		</div>
	);
};

export default MostUsefulCondition;
