import { React } from "react";
import { useNavigate } from "react-router-dom";
import MostUsefulConditions from "./MostUsefulConditions.jsx";

const MostUseful = () => {
	const navigate = useNavigate();

	return (
		<div className="component-layout bg-white rounded-xl p-3 w-full shadow-2xl">
			<div className="flex items-center justify-between ">
				<h2 className="font-semibold">Most Useful </h2>
				<button
					className="btn-green text-base"
					onClick={() => navigate("/campus-condition/upload-condition")}
				>
					Upload New
				</button>
			</div>
			<MostUsefulConditions />
		</div>
	);
};

export default MostUseful;
