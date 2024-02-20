import React, { useState } from "react";
import { FaImages } from "react-icons/fa/index.js";

const UploadImage = ({ setImage, setImagePath, imagePath }) => {
	const [isImageAdded, setIsImageAdded] = useState(false);

	const handleClick = () => {
		const file = document.getElementById("img-file");
		file.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			setImagePath(URL.createObjectURL(file));
			setImage(file);
			setIsImageAdded(true);
		}
	};

	return (
		<div
			className="border border-secondary rounded-3 d-flex align-items-center justify-content-center "
			style={{ minHeight: "150px", cursor: "pointer" }}
			onClick={handleClick}
			id="upload-img-container"
		>
			{isImageAdded ? (
				<img
					src={imagePath}
					alt="Post image"
					className="img-fluid rounded-3 add-new-image"
				/>
			) : (
				<div className="d-flex align-items-center">
					<FaImages className="fs-4 me-2" />
					<p className="m-0">Upload image</p>
				</div>
			)}

			<input
				type="file"
				id="img-file"
				accept="image/*"
				style={{ display: "none" }}
				onChange={handleImageChange}
			/>
		</div>
	);
};

export default UploadImage;
