import React from "react";
import ContactNumberInput from "./ContactNumberInput.jsx";

const ContactNumberInputs = ({ state, dispatch }) => {
	return state.contactNumbers.map((contactNumber) => (
		<ContactNumberInput
			key={contactNumber.id}
			contactNumber={contactNumber}
			dispatch={dispatch}
		/>
	));
};

export default ContactNumberInputs;
