import { React } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaPlayCircle, FaFlagCheckered } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import ViewButton from "../ViewButton.jsx";
import ContactButton from "../ContactButton.jsx";
import EditButton from "../EditButton.jsx";

const Event = ({ event }) => {
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);

	return (
		<div className="col-span-6 md:col-span-4 lg:col-span-3 rounded-xl p-2 my-2 border shadowDesign border-gray-300 marketplace-card flex flex-col">
			{/* EVENT IMAGE */}
			<img
				src={event.eventPosterImagePath}
				alt="Event poster iamge"
				className="col-span-2 border border-blue-400 rounded-lg self-center mb-2 flex-1 max-h-64"
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
			{/* VIEW BUTTON */}
			<ViewButton path={`/marketplace/event/view-event/${event._id}`} />
			{user._id !== event.userId ? (
				// CONTACT BUTTON
				<ContactButton contactUserId={event.userId} marginTop={true} />
			) : (
				// EDIT BUTTON
				<EditButton path={`/marketplace/event/edit-event/${event._id}`} />
			)}
		</div>
	);
};

export default Event;
