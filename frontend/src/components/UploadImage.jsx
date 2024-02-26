import React, { useState, useEffect } from "react";
import { FaImages } from "react-icons/fa/index.js";

const UploadImage = ({ imagePath, dispatch }) => {
	const handleClick = () => {
		const file = document.getElementById("img-file");
		file.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const newImagePath = URL.createObjectURL(file);
			dispatch.setImagePath(newImagePath);
			dispatch.setImage(file);
			dispatch.setHasChanged(true);
		}
	};

	return (
		<div
			className={`border border-gray-600 rounded-xl flex items-center justify-center cursor-pointer my-2 hover:opacity-80 ${
				imagePath === "" && "py-5"
			}`}
			onClick={handleClick}
			id="upload-img-container"
		>
			{imagePath !== "" ? (
				<img
					src={imagePath}
					alt="Post image"
					className="rounded-xl h-full max-h-52"
				/>
			) : (
				<div className="flex items-center">
					<FaImages className="mr-2" />
					<p>Upload image</p>
				</div>
			)}

			<input
				className="hidden"
				type="file"
				id="img-file"
				accept="image/*"
				onChange={handleImageChange}
			/>
		</div>
	);
};

export default UploadImage;
