import React from "react";
import FAQsElement from "../smallComponents/FAQsElement.jsx";
import Title from "../smallComponents/Title.jsx";

const FAQs = () => {
	const lists = [
		{
			question: "What is FSKTMConnect?",
			answer:
				"FSKTMConnect is a social media platform designed specifically for FSKTM students to connect, share, and collaborate.",
		},
		{
			question: "Is FSKTMConnect free to use?",
			answer: "Yes, FSKTMConnect is free to use.",
		},
		{
			question: "How can I report inappropriate content or users?",
			answer:
				"You can report inappropriate content or groups by using the reporting feature available on each post, group, product, service and event. Our moderation team will review reports promptly.",
		},
		{
			question: "How does FSKTMConnect protect my privacy?",
			answer:
				"We prioritize the security and privacy of our users. We have implemented measures to safeguard your personal information. Please refer to our Privacy Policy for details.",
		},
		{
			question: "How can I update my profile frame color?",
			answer:
				"Please navigate to Setting page -> Account setting -> Frame preference to update your profile frame color.",
		},
	];

	return (
		<div>
			{/* TITLE */}
			<Title title="FAQs" />
			{lists.map((element, index) => (
				<FAQsElement element={element} key={index} />
			))}
		</div>
	);
};

export default FAQs;
