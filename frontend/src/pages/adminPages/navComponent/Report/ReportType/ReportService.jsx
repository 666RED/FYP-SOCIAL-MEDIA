import React from "react";
import ServiceInfo from "../../../../marketplacePages/pages/mainPages/components/service/ServiceInfo.jsx";
import SellerInfo from "../../../../../components/SellerInfo.jsx";

const ReportService = ({ target }) => {
	return (
		<div className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3">
			{/* SERVICE INFORMATION */}
			<ServiceInfo service={target} />
			{/* HORIZONTAL LINE */}
			<hr className="my-2 border border-gray-400" />
			{/* SELLER INFORMATION */}
			<SellerInfo
				name="Service Provider"
				state={target}
				handleOnClick={null}
				isAdmin={true}
			/>
		</div>
	);
};

export default ReportService;
