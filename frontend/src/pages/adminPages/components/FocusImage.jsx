import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const FocusImage = ({ imagePath, setShowImage, isProfileImage = false }) => {
	return (
		<div className="center-container items-center flex-col md:flex-row py-2 px-5 md:px-32 bg-black bg-opacity-90">
			<FaArrowLeft
				className="cursor-pointer self-start text-white text-2xl flex-shrink-0"
				onClick={() => setShowImage(false)}
			/>
			<div className="overflow-auto ml-2">
				<img
					src={imagePath}
					alt="Focus image"
					className={`border border-black max-h-[35rem] ${
						isProfileImage ? "rounded-full" : "rounded-xl"
					} `}
				/>
			</div>
		</div>
	);
};

export default FocusImage;
