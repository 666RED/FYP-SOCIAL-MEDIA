import { React } from "react";
import { useSelector } from "react-redux";
import { GoogleMap, Marker } from "@react-google-maps/api";
import PlaceAutoComplete from "./PlaceAutoComplete.jsx";

const Map = () => {
	const { center, selected, viewMode } = useSelector(
		(store) => store.campusCondition
	);

	return (
		<>
			<div className="places-container">
				{!viewMode && <PlaceAutoComplete />}
			</div>
			<GoogleMap
				zoom={16}
				center={center}
				mapContainerClassName="map-container"
			>
				{selected && <Marker position={selected} />}
			</GoogleMap>
		</>
	);
};

export default Map;
