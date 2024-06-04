import React from "react";
import { FaImage } from "react-icons/fa";

const ImageRow = ({ imagePath, setShowImage, imageRemoved = false }) => {
	return imagePath === "" || imageRemoved ? (
		<p className="text-center">No image</p>
	) : (
		<FaImage
			onClick={() => setShowImage(true)}
			className="mx-auto text-xl hover:text-blue-600 cursor-pointer"
		/>
	);
};

export default ImageRow;
