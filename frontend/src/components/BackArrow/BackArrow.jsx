import { React, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa/index.js";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ discardChanges = false }) => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || null;
		navigate(previousArr[previousArr.length - 1]);
		previousArr.pop();
		localStorage.setItem("previous", JSON.stringify(previousArr));
	};

	return (
		<div>
			<FaArrowLeft
				className="text-lg cursor-pointer hover:opacity-80"
				onClick={() => {
					if (!discardChanges) {
						handleGoBack();
						return;
					}
					const answer = window.confirm("Discard changes?");
					if (answer) {
						handleGoBack();
					}
				}}
			/>
		</div>
	);
};

export default BackArrow;
