import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
	FaCalendarAlt,
	FaPlayCircle,
	FaFlagCheckered,
	FaPhoneAlt,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { ServerContext } from "../../../../../../App.js";

const Event = ({ event }) => {
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);

	const filePath = `${serverURL}/public/images/event/`;
	const path =
		event.userId === user._id
			? `/marketplace/event/edit-event/${event._id}`
			: `/marketplace/event/view-event/${event._id}`;

	return (
		<div
			className="col-span-6 md:col-span-4 lg:col-span-3 rounded-xl p-2 my-2 border shadow-xl border-gray-300 marketplace-card flex flex-col cursor-pointer hover:bg-gray-200"
			onClick={() => navigate(path)}
		>
			{/* EVENT IMAGE */}
			<img
				src={`${filePath}${event.eventPosterImagePath}`}
				alt="Event poster iamge"
				className="col-span-2 border border-blue-400 rounded-lg self-center mb-2 flex-1 w-full"
			/>
			{/* EVENT NAME */}
			<p>{event.eventName}</p>
			{/* EVENT TIME */}
			{event.isOneDayEvent ? (
				// ONE DAY EVENT
				<div>
					{/* DATE */}
					<div className="flex items-center">
						<FaCalendarAlt />
						<p className="ml-2">{event.eventOneDate}</p>
					</div>
					{/* TIME */}
					<div className="flex items-center">
						<IoMdTime />
						<p className="ml-2">
							{event.eventStartTime}-{event.eventEndTime}
						</p>
					</div>
				</div>
			) : (
				// NOT ONE DAY
				<div>
					<div className="flex items-center">
						<FaPlayCircle />
						<p className="ml-2">{event.eventStartDate}</p>
					</div>
					<div className="flex items-center">
						<FaFlagCheckered />
						<p className="ml-2">{event.eventEndDate}</p>
					</div>
				</div>
			)}
			{/* EVENT VENUE */}
			<div className="flex items-center">
				<IoLocationSharp />
				<p className="ml-2">{event.eventVenue}</p>
			</div>
			{/* CONTACT NUMBER */}
			<div className="flex items-center">
				<FaPhoneAlt />
				<p className="ml-2">{event.contactNumbers[0]}</p>
			</div>
		</div>
	);
};

export default Event;
