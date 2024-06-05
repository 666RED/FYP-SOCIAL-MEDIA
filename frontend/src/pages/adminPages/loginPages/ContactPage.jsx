import { React } from "react";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import FormBackArrowHeader from "../../../components/BackArrow/FormBackArrowHeader.jsx";
import HorizontalRule from "../../../components/HorizontalRule.jsx";

const ContactPage = () => {
	return (
		<div className="main-container">
			<div className="form-container">
				{/* HEADER */}
				<FormBackArrowHeader destination={"/admin"} title="Contact Us" />
				<HorizontalRule />
				{/* INSTRUCTION */}
				<p className="text-lg">
					Please contact the phone number or write an email to us so that we can
					assist you in recovering your password:
				</p>
				{/* PHONE ICON & PHONE NUMBER */}
				<div className="flex items-center mt-4 mb-2">
					<FaPhone className="mr-2" />
					<p>01110789940</p>
				</div>
				<div className="flex items-center">
					<MdEmail className="mr-2" />
					<p>fsktmconnect@gmail.com</p>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
