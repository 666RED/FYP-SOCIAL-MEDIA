import { React } from "react";
import { useNavigate } from "react-router-dom";
import MostUsefulConditions from "./MostUsefulConditions.jsx";

const MostUseful = () => {
	const navigate = useNavigate();

	return (
		<div className="component-layout bg-white rounded-xl p-3 w-full shadow-2xl">
			<div className="flex items-center justify-between ">
				{/* TITLE */}
				<h2 className="font-semibold">Most Useful </h2>
			</div>
			{/* CONDITIONS */}
			<MostUsefulConditions />
		</div>
	);
};

export default MostUseful;
