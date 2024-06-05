import { React, useContext } from "react";
import { IoLocationSharp, IoTime } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { FaCalendarAlt, FaPlayCircle, FaFlagCheckered } from "react-icons/fa";
import { ServerContext } from "../../../../../../App.js";

const EventInfo = ({ event }) => {
	const serverURL = useContext(ServerContext);

	return (
		<div className="flex flex-col">
			{/* EVENT POSTER IMAGE */}
			<img
				src={event.eventPosterImagePath}
				alt="Event poster image"
				className="rounded-xl self-center max-img-height"
			/>
			{/* EVENT NAME */}
			<p className="border border-gray-400 rounded-xl p-3 mt-3">
				{event.eventName}
			</p>
			{/* EVENT DESCRIPTION */}
			<p className="border border-gray-400 rounded-xl p-3 my-2">
				{event.eventDescription}
			</p>
			{/* EVENT VENUE */}
			<div className="flex items-center border border-gray-400 rounded-xl p-3">
				<IoLocationSharp className="mr-2" />
				<p>{event.eventVenue}</p>
			</div>
			{/* EVENT ORGANIZER */}
			<p className="border border-gray-400 rounded-xl p-3 my-2 flex items-center">
				<MdGroups className="mr-2 text-lg" />
				{event.eventOrganizer}
			</p>
			{/* EVENT DATE */}
			{event.isOneDayEvent ? (
				// ONE DAY EVENT
				<div>
					{/* EVENT DATE */}
					<p className="border border-gray-400 rounded-xl p-3 my-2 flex items-center">
						<FaCalendarAlt className="mr-2" />
						{event.eventOneDate}
					</p>
					{/* EVENT TIME */}
					<p className="border border-gray-400 rounded-xl p-3 my-2 flex items-center">
						<IoTime className="mr-2" />
						{`${event.eventStartTime}-${event.eventEndTime}`}
					</p>
				</div>
			) : (
				// MULTIPLE DAYS EVENT
				<p className="flex items-center border border-gray-400 rounded-xl p-3 my-2">
					<FaCalendarAlt className="mr-2" />
					{`${event.eventStartDate} - ${event.eventEndDate}`}
				</p>
			)}
		</div>
	);
};

export default EventInfo;
