import { React, useContext } from "react";
import { ServerContext } from "../../../../../../App.js";
import { capitalize } from "../../../../../../usefulFunction.js";

const ServiceInfo = ({ service }) => {
	const serverURL = useContext(ServerContext);

	return (
		<div className="flex flex-col">
			{/* SERVICE POSTER IMAGE */}
			<img
				src={service.servicePosterImagePath}
				alt="Service post image"
				className="rounded-xl self-center max-img-height"
			/>
			{/* SERVICE NAME */}
			<p className="mt-3 border border-gray-400 rounded-xl p-3">
				{service.serviceName}
			</p>
			{/* SERVICE DESCRIPTION */}
			<p className="my-2 border border-gray-400 rounded-xl p-3">
				{service.serviceDescription}
			</p>
			{/* SERVICE CATEGORY */}
			<p className="mb-2 border border-gray-400 rounded-xl p-3">
				{`Category: ${capitalize(service.serviceCategory)}`}
			</p>
		</div>
	);
};

export default ServiceInfo;
