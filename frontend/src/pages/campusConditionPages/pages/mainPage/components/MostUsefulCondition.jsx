import React from "react";
import { useNavigate } from "react-router-dom";
import { HiThumbUp, HiThumbDown } from "react-icons/hi";
import { IoIosCheckmarkCircle } from "react-icons/io";

const MostUsefulCondition = ({ condition }) => {
	const navigate = useNavigate();
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
			{/* UP AND DOWN ROW */}
			<div className="flex items-center mt-1">
				{/* UP */}
				<div className="flex items-center">
					<HiThumbUp />
					<p className="ml-1">{`${condition.conditionUp}`}</p>
				</div>
				{/* DOWN */}
				<div className="flex items-center ml-2">
					<HiThumbDown />
					<p className="ml-1">{`${condition.conditionDown}`}</p>
				</div>
			</div>
			{/* UPLOAD TIME */}
			<p className="">{`Uploaded ${condition.time}`}</p>
		</div>
	);
};

export default MostUsefulCondition;
