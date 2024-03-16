import React from "react";
import { FaImages } from "react-icons/fa/index.js";

const UploadImage = ({ imagePath, dispatch, bigImage = true }) => {
	const handleClick = () => {
		const file = document.getElementById("img-file");
		file.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const newImagePath = URL.createObjectURL(file);

			dispatch({ imagePath: newImagePath, image: file, hasChanged: true });
		}
	};

	return (
		<div
			className={`border-gray-600 rounded-xl flex items-center justify-center cursor-pointer my-2 hover:opacity-80 ${
				imagePath === "" && "py-5 border"
			}`}
			onClick={handleClick}
		>
			{imagePath !== "" ? (
				<img
					src={imagePath}
					alt="Post image"
					className={`rounded-xl ${!bigImage && "max-h-52 md:max-h-56"}`}
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
