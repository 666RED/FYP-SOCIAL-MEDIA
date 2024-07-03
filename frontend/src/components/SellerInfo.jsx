import { React } from "react";
import { useSelector } from "react-redux";
import ContactButton from "../pages/marketplacePages/pages/mainPages/components/ContactButton.jsx";

const SellerInfo = ({ state, handleOnClick, name, isAdmin = false }) => {
	const { user } = useSelector((store) => store.auth);
	return (
		<div>
			<h3 className="mb-2">{name}</h3>
			<div className="flex items-center">
				{/* PROFILE IMAGE */}
				<img
					src={state.userProfileImagePath}
					alt="Seller profile image"
					className={`rounded-full border-[2.5px] ${state.frameColor} w-14 h-14 mr-2 md:w-20 md:h-20 object-cover`}
				/>
				{/* SELLER NAME */}
				<div className="flex flex-col">
					<p
						className={`${!isAdmin && "cursor-pointer hover:opacity-80"}`}
						onClick={!isAdmin ? handleOnClick : null}
					>
						{state.userName}
					</p>
					{/* CONTACT BUTTON */}
					{user._id !== state.userId && (
						<ContactButton
							contactUserId={state.userId}
							path={window.location.pathname}
							marginTop={true}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default SellerInfo;
