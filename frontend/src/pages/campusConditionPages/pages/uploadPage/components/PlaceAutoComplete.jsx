import React from "react";
import { useDispatch } from "react-redux";
import usePlacesAutoComplete, {
	getGeocode,
	getLatLng,
} from "use-places-autocomplete";
import { changeLocation } from "../../../features/campusConditionSlice.js";

const PlaceAutoComplete = () => {
	const sliceDispatch = useDispatch();
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutoComplete();

	const handleSelect = async (e) => {
		const address = e.target.innerText;

		clearSuggestions();
		setValue("");

		const results = await getGeocode({ address });
		const { lat, lng } = getLatLng(results[0]);

		sliceDispatch(changeLocation({ location: { lat, lng } }));
	};

	return (
		<div className="mt-1">
			{/* INPUT */}
			<input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				disabled={!ready}
				placeholder="Search..."
			/>
			{/* POP OUT */}
			<div className="relative">
				<div
					className={`absolute z-10 bg-white border border-black px-2 mt-1 ${
						value === "" && "hidden"
					}`}
				>
					{status === "OK" &&
						data.map(({ place_id, description }) => (
							<li
								key={place_id}
								className="list-none hover:bg-gray-200 cursor-pointer"
								onClick={handleSelect}
								value={description}
							>
								{description}
							</li>
						))}
				</div>
			</div>
		</div>
	);
};

export default PlaceAutoComplete;
