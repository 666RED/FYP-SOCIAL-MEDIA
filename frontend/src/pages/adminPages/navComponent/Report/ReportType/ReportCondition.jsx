import { React, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
import PostHeader from "../../../components/PostHeader.jsx";
import ViewLocation from "../../../../campusConditionPages/pages/mainPage/components/ViewLocation.jsx";
import { loadMap } from "../../../../campusConditionPages/features/campusConditionSlice.js";
import { ServerContext } from "../../../../../App.js";

const ReportCondition = ({ target }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);

	const [viewLocation, setViewLocation] = useState(false);

	const handleViewLocation = () => {
		sliceDispatch(
			loadMap({
				lat: parseFloat(target.conditionLocation.locationLatitude),
				lng: parseFloat(target.conditionLocation.locationLongitude),
			})
		);
		setViewLocation(true);
	};

	return (
		<div>
			{/* VIEW LOCATION DIV*/}
			{viewLocation && (
				<ViewLocation toggleViewLocation={() => setViewLocation(false)} />
			)}
			{/* HEADER */}
			<PostHeader
				imagePath={target.profileImagePath}
				time={target.time}
				userName={target.userName}
			/>
			{/* CONDITION TITLE */}
			<p className="font-semibold mt-2">{target.conditionTitle}</p>
			{/* CONDITION DESCRIPTION */}
			<p>{target.conditionDescription}</p>
			{/* CONDITION IMAGE */}
			{target.conditionImagePath !== "" && (
				<img
					src={target.conditionImagePath}
					alt="Condition image"
					className="rounded-xl mt-2"
				/>
			)}
			{/* VIEW LOCATION TEXT*/}
			<div
				className="inline-flex mt-3 cursor-pointer text-blue-600 hover:opacity-80"
				onClick={() => handleViewLocation()}
			>
				<FaMapMarkerAlt className="text-lg mr-1" />
				<p>View location</p>
			</div>
		</div>
	);
};

export default ReportCondition;
