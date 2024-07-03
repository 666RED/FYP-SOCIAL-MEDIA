import React from "react";
import { useNavigate } from "react-router-dom";

const ContactButton = ({
	contactUserId,
	path = `/marketplace`,
	text = "Contact",
	marginTop = false,
}) => {
	const navigate = useNavigate();

	const handleOnClick = (e) => {
		e.stopPropagation();
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(path);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/chat/${contactUserId}`);
	};

	return (
		<button
			className={`btn-dark-blue text-sm sm:text-base ${
				marginTop ? "mt-2" : "mt-0"
			} w-full`}
			onClick={handleOnClick}
		>
			{text}
		</button>
	);
};

export default ContactButton;
