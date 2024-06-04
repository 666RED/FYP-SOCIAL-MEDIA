import React from "react";
import EventInfo from "../../../../marketplacePages/pages/mainPages/components/event/EventInfo.jsx";
import SellerInfo from "../../../../../components/SellerInfo.jsx";
import { FaPhoneAlt } from "react-icons/fa";

const ReportEvent = ({ target }) => {
	return (
		<div className="mx-auto w-4/5 border border-gray-500 rounded-xl mt-5 p-3 md:max-w-[50rem]">
			{/* EVENT INFORMATION */}
			<EventInfo event={target} />
			{/* HORIZONTAL LINE */}
			<hr className="my-2 border border-gray-400" />
			{/* SELLER INFORMATION */}
			<SellerInfo
				handleOnClick={null}
				name="Event Promoter"
				state={{ ...target, contactNumber: target.contactNumbers[0] }}
				isAdmin={true}
			/>
			{/* OTHER CONTACT NUMBERS */}
			{target.contactNumbers.length > 1 && (
				<div>
					{/* HORIZONTAL LINE */}
					<hr className="my-2 border border-gray-400" />
					<h3 className="mt-3 mb-2">Other contact numbers</h3>
					<div className="flex items-center">
						<FaPhoneAlt className="mr-2" />
						{target.contactNumbers.filter((_, index) => index !== 0).join(", ")}
					</div>
				</div>
			)}
		</div>
	);
};

export default ReportEvent;
