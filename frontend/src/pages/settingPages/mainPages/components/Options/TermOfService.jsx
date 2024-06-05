import React from "react";
import TermOfServiceElement from "../smallComponents/TermOfServiceElement.jsx";
import Title from "../smallComponents/Title.jsx";

const TermOfService = () => {
	const termOfServices = [
		{
			title: "Acceptance of Terms",
			text: "By accessing or using FSKTMConnect, you agree to abide by these Terms of Service and all applicable laws and regulations.",
		},
		{
			title: "User Responsibilities",
			text: "Users are responsible for their actios and content shared on the platform. You must not engage in any unlawful or prohibited activities.",
		},
		{
			title: "Content Ownership",
			text: "Users retain ownership of the content they post. However, by posting content on FSKTMConnect, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and display your content.",
		},
		{
			title: "Privacy",
			text: "We respect your privacy. Please refer to our Privacy Policy for details on how we collect, use, and protect your personal information.",
		},
		{
			title: "Modification of Terms",
			text: "We reserve the right to update or modify these Terms of Service at any time. Changes will be effective upon posting on the platform.",
		},
		{
			title: "Termination",
			text: "We may terminate or suspend your access to FSKTMConnect without prior notice for violations of these Terms of Service.",
		},
		{
			title: "Contact Us",
			text: " If you have any questions about these Terms of Service, please contact us at fsktmconnect@gmail.com.",
		},
	];

	return (
		<div>
			{/* TITLE */}
			<Title title="Term of Service" />
			<p className="mb-2">
				Welcome to FSKTMConnect! These Terms of Service outline the rules and
				regulations for the use of our social media platform.
			</p>
			{/* CONTENT */}
			{termOfServices.map((termOfService, index) => (
				<TermOfServiceElement termOfService={termOfService} key={index} />
			))}
		</div>
	);
};

export default TermOfService;
