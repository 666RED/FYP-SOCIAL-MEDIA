import React, { useState } from "react";
import Filter from "../Filter.jsx";
import Spinner from "../Spinner/Spinner.jsx";

const SendImage = ({ handleSubmit, setImagePath, imagePath, loading }) => {
	const handleCancel = () => {
		setImagePath("");
	};

	return (
		<div>
			<Filter />
			{loading && <Spinner />}
			<div className="z-40 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
				{/* WRAPPER */}
				<div className="h-[90%] flex flex-col justify-center">
					{/* IMAGE */}
					<img
						src={imagePath}
						alt="Image"
						className="rounded-xl mx-2 max-h-[90%]"
					/>
					{/* BUTTON ROW */}
					<div className="flex items-center justify-around mt-5">
						{/* SNED BUTTON */}
						<button
							className="btn-blue w-5/12 text-base hover:opacity-100 hover:bg-blue-500"
							onClick={handleSubmit}
						>
							SEND
						</button>
						{/* CANCEL BUTTON */}
						<button
							className="btn-gray w-5/12 text-base hover:opacity-100 hover:bg-gray-500"
							onClick={handleCancel}
						>
							CANCEL
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SendImage;
