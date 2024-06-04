import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import EventRow from "./EventRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { eventContext } from "./EventPage.jsx";

const EventRows = () => {
	const { loading, currentEvents, indexOfFirstEvent } =
		useContext(eventContext);

	return loading ? (
		<Loader />
	) : currentEvents.length > 0 ? (
		currentEvents.map((event, index) => (
			<EventRow
				event={event}
				key={event._id}
				count={indexOfFirstEvent + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default EventRows;
