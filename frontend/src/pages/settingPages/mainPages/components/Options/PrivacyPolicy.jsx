import React from "react";
import PrivacyPolicyElements from "../smallComponents/PrivacyPolicyElements.jsx";
import Title from "../smallComponents/Title.jsx";

const PrivacePolicy = () => {
	const privacyPolicies = [
		{
			title: "Information We Collect",
			text: "We collect personal information such as name, gender, email address, and phone number when you register for an account.",
		},
		{
			title: "How We Use Your Information",
			text: "We use your information to provide and improve our services, communicate with you, and personalize your experience on the platform.",
		},
		{
			title: "Sharing of Information",
			text: "We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating the platform.",
		},
		{
			title: "Security",
			text: "We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure.",
		},
		{
			title: "User Choices",
			text: "You can manage your account settings and preferences, such as changing your profile frame color and update your personal information.",
		},
		{
			title: "Updates to Privacy Policy",
			text: "We may update our Privacy Policy periodically. We will notify you of any material changes through the platform.",
		},
		{
			title: "Contact Us",
			text: "If you have questions about our Privacy Policy, please contact us at fsktmconnect@gmail.com.",
		},
	];

	return (
		<div>
			{/* TITLE */}
			<Title title="Privacy Policy" />
			<p className="mb-2">
				Protecting your privacy is important to us. Our Privacy Policy explains
				how we collect, use, disclose, and safeguard your information when you
				use FSKTMConnect.
			</p>
			{/* CONTENT */}
			{privacyPolicies.map((privacyPolicy, index) => (
				<PrivacyPolicyElements privacyPolicy={privacyPolicy} key={index} />
			))}
		</div>
	);
};

export default PrivacePolicy;
