import React, { useState, useContext } from "react";
import { FaImages } from "react-icons/fa/index.js";
import { MyContext } from "../pages/profilePages/components/AddNewPostForm.jsx";
import { ACTION_TYPES } from "../pages/profilePages/actionTypes/addNewPostFormActionTypes.js";

const UploadImage = () => {
	const [isImageAdded, setIsImageAdded] = useState(false);
	const { state, dispatch } = useContext(MyContext);

	const handleClick = () => {
		const file = document.getElementById("img-file");
		file.click();
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			dispatch({
				type: ACTION_TYPES.SET_IMAGE_PATH,
				payload: URL.createObjectURL(file),
			});
			dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: file });
			dispatch({ type: ACTION_TYPES.MADE_CHANGE, payload: true });
			setIsImageAdded(true);
		}
	};

	return (
		<div
			className={`border border-gray-600 rounded-xl flex items-center justify-center cursor-pointer my-2 hover:opacity-80 ${
				!isImageAdded && "py-5"
			}`}
			onClick={handleClick}
			id="upload-img-container"
		>
			{isImageAdded ? (
				<img
					src={state.imagePath}
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
