import React from "react";
import { FaImages } from "react-icons/fa/index.js";

const UploadCircleImage = ({ imagePath, dispatch, bigImage = true }) => {
	const handleClick = () => {
		const file = document.getElementById("circle-img-file");
		file.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const ratio = img.width / img.height;
					if (ratio <= 16 / 9) {
						const newImagePath = URL.createObjectURL(file);
						dispatch({
							imagePath: newImagePath,
							image: file,
							hasChanged: true,
						});
					} else {
						alert("Image ratio should not be greater than 16:9.");
					}
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div
			className={`border border-gray-600 h-36 w-36 md:h-56 md:w-56 mx-auto rounded-full flex place-content-center cursor-pointer my-2 hover:opacity-80 ${
				imagePath === "" && "py-5"
			}`}
			onClick={handleClick}
		>
			{imagePath !== "" ? (
				<img
					src={imagePath}
					alt="Post image"
					className={`rounded-full ${
						!bigImage && "max-h-52 md:max-h-56"
					} object-cover`}
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
				id="circle-img-file"
				accept="image/*"
				onChange={handleImageChange}
			/>
		</div>
	);
};

export default UploadCircleImage;
