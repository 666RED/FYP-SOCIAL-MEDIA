import { React } from "react";
import { FaArrowLeft } from "react-icons/fa/index.js";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ discardChanges = false, white = false }) => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || null;
		navigate(previousArr[previousArr.length - 1]);
		previousArr.pop();
		localStorage.setItem("previous", JSON.stringify(previousArr));
	};

	return (
		<FaArrowLeft
			className={`text-lg cursor-pointer hover:opacity-80 ${
				white && "text-white"
			}`}
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
	);
};

export default BackArrow;
