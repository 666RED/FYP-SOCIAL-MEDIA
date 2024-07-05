import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const FocusImage = ({ imagePath, setShowImage, isProfileImage = false }) => {
	return (
		// CONTAINER
		<div className="center-container items-center flex-col py-2 px-5 md:px-32 bg-black bg-opacity-90">
			{/* WRAPPER */}
			<div className="h-[90%] flex flex-col justify-center">
				{/* WHITE ARROW */}
				<FaArrowLeft
					className="cursor-pointer self-start text-white text-2xl mb-2 flex-shrink-0"
					onClick={() => setShowImage(false)}
				/>
				{/* IMAGE */}
				<img
					src={imagePath}
					alt="Focus image"
					className={`border border-black ml-2 max-h-full ${
						isProfileImage ? "rounded-full w-[28rem]" : "rounded-xl"
					} `}
				/>
			</div>
		</div>
	);
};

export default FocusImage;
