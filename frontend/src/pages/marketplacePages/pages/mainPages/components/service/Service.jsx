import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPhoneAlt } from "react-icons/fa";
import { ServerContext } from "../../../../../../App.js";

const Service = ({ service }) => {
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);

	const path =
		service.userId === user._id
			? `/marketplace/service/edit-service/${service._id}`
			: `/marketplace/service/view-service/${service._id}`;

	return (
		<div
			className="col-span-6 md:col-span-4 lg:col-span-3 rounded-xl p-3 my-2 border shadow-xl border-gray-300 marketplace-card flex flex-col cursor-pointer hover:bg-gray-200"
			onClick={() => navigate(path)}
		>
			{/* SERVICE IMAGE */}
			<img
				src={service.servicePosterImagePath}
				alt="Service image"
				className="col-span-2 border border-blue-400 rounded-lg self-center mb-2 flex-1 max-h-64"
			/>
			{/* SERVICE NAME */}
			<p>{service.serviceName}</p>
			{/* CONTACT NUMBER */}
			<div className="flex items-center">
				<FaPhoneAlt className="mr-2" />
				<p>{service.contactNumber}</p>
			</div>
		</div>
	);
};

export default Service;
