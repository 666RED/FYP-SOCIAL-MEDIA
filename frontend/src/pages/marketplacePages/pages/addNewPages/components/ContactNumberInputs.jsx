import { React, useContext } from "react";
import ContactNumberInput from "./ContactNumberInput.jsx";
import { EventContext } from "../CreateNewItem.jsx";

const ContactNumberInputs = () => {
	const { state } = useContext(EventContext);

	return state.contactNumbers.map((contactNumber) => {
		return (
			<ContactNumberInput
				key={contactNumber.id}
				contactNumber={contactNumber}
			/>
		);
	});
};

export default ContactNumberInputs;
