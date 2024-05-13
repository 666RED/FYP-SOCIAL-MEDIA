import { React, useContext } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { ServerContext } from "../App.js";

const SellerInfo = ({ state, handleOnClick, name }) => {
	const serverURL = useContext(ServerContext);
	const profileImagePath = `${serverURL}/public/images/profile/`;

	return (
		<div>
			<h3 className="mb-2">{name}</h3>
			<div className="flex items-center">
				{/* PROFILE IMAGE */}
				<img
					src={`${profileImagePath}${state.userProfileImagePath}`}
					alt="Seller profile image"
					className="rounded-full border border-blue-400 w-14 mr-2 md:w-20"
				/>
				{/* SELLER NAME */}
				<div>
					<p
						className="cursor-pointer hover:opacity-80"
						onClick={handleOnClick}
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
