import { React } from "react";
import { useSelector } from "react-redux";
import ContactButton from "../ContactButton.jsx";
import EditButton from "../EditButton.jsx";
import ViewButton from "../ViewButton.jsx";

const Service = ({ service }) => {
	const { user } = useSelector((store) => store.auth);

	return (
		<div className="col-span-6 md:col-span-4 lg:col-span-3 rounded-xl p-3 my-2 border shadowDesign border-gray-300 marketplace-card flex flex-col">
			{/* SERVICE IMAGE */}
			<img
				src={service.servicePosterImagePath}
				alt="Service image"
				className="col-span-2 border border-blue-400 rounded-lg self-center mb-2 flex-1 max-h-64"
			/>
			{/* SERVICE NAME */}
			<p>{service.serviceName}</p>
			{/* VIEW BUTTON */}
			<ViewButton path={`/marketplace/service/view-service/${service._id}`} />
			{user._id !== service.userId ? (
				// CONTACT BUTTON
				<ContactButton contactUserId={service.userId} marginTop={true} />
			) : (
				// EDIT BUTTON
				<EditButton path={`/marketplace/service/edit-service/${service._id}`} />
			)}
		</div>
	);
};

export default Service;
