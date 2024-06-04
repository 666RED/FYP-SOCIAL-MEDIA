import { React, useState, useContext } from "react";
import FocusImage from "../../components/FocusImage.jsx";
import ImageRow from "../../components/ImageRow.jsx";
import StatusText from "../../components/StatusText.jsx";
import { ServerContext } from "../../../../App.js";

const EventRow = ({ event, count }) => {
	const serverURL = useContext(ServerContext);
	const [showImage, setShowImage] = useState(false);
	const eventImagePath = `${serverURL}/public/images/event/`;

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{event.name}</td>
			<td>{event.description}</td>
			<td>
				<ImageRow
					imagePath={event.imagePath}
					setShowImage={setShowImage}
					imageRemoved={event.removed}
				/>
			</td>
			<td>{event.poster}</td>
			<td>{event.organizer}</td>
			<td>{event.venue}</td>
			<td>
				<select>
					{event.contactNumbers.map((number) => (
						<option value={number}>{number}</option>
					))}
				</select>
			</td>
			<td className="text-center">{event.uploaded}</td>
			<StatusText isRemoved={event.removed} />
			{showImage && (
				<FocusImage
					imagePath={`${eventImagePath}${event.imagePath}`}
					setShowImage={setShowImage}
				/>
			)}
		</tr>
	);
};

export default EventRow;
