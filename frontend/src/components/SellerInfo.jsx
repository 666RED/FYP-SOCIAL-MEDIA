import { React } from "react";
import { FaPhoneAlt } from "react-icons/fa";

const SellerInfo = ({ state, handleOnClick, name, isAdmin = false }) => {
	return (
		<div>
			<h3 className="mb-2">{name}</h3>
			<div className="flex items-center">
				{/* PROFILE IMAGE */}
				<img
					src={state.userProfileImagePath}
					alt="Seller profile image"
					className={`rounded-full border-[2.5px] ${state.frameColor} w-14 mr-2 md:w-20`}
				/>
				{/* SELLER NAME */}
				<div>
					<p
						className={`${!isAdmin && "cursor-pointer hover:opacity-80"}`}
						onClick={!isAdmin ? handleOnClick : null}
					>
						{state.userName}
					</p>
					<div className="flex items-center">
						<FaPhoneAlt className="mr-2" />
						<p>{state.contactNumber}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SellerInfo;
