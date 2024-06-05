import { React, useState, useContext } from "react";
import FocusImage from "../../components/FocusImage.jsx";
import ImageRow from "../../components/ImageRow.jsx";
import StatusText from "../../components/StatusText.jsx";
import { ServerContext } from "../../../../App.js";
import { capitalize } from "../../../../usefulFunction.js";

const ServiceRow = ({ service, count }) => {
	const serverURL = useContext(ServerContext);
	const [showImage, setShowImage] = useState(false);

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{service.name}</td>
			<td>{service.description}</td>
			<td>
				<ImageRow
					imagePath={service.imagePath}
					setShowImage={setShowImage}
					imageRemoved={service.removed}
				/>
			</td>
			<td>{service.poster}</td>
			<td>{capitalize(service.category)}</td>
			<td>{service.contactNumber}</td>
			<td className="text-center">{service.uploaded}</td>
			<StatusText isRemoved={service.removed} />
			{showImage && (
				<FocusImage imagePath={service.imagePath} setShowImage={setShowImage} />
			)}
		</tr>
	);
};

export default ServiceRow;
