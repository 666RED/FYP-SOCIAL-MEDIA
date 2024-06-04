import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import ServiceRow from "./ServiceRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { serviceContext } from "./ServicePage.jsx";

const ServiceRows = () => {
	const { loading, currentServices, indexOfFirstService } =
		useContext(serviceContext);

	return loading ? (
		<Loader />
	) : currentServices.length > 0 ? (
		currentServices.map((service, index) => (
			<ServiceRow
				service={service}
				key={service._id}
				count={indexOfFirstService + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default ServiceRows;
