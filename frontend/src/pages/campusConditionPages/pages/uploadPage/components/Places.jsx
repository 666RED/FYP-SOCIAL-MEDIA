import React from "react";
import Map from "./Map.jsx";
import { useLoadScript } from "@react-google-maps/api";

const Places = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries: ["places"],
	});

	if (!isLoaded) {
		return <div>...Loading</div>;
	}

	return <Map />;
};

export default Places;
