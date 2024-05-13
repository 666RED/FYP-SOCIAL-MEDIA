import { React, useContext } from "react";
import { EventContext } from "../CreateNewItem.jsx";
import { MdCancel } from "react-icons/md";
import ACTION_TYPES from "../actionTypes/createEventActionTypes.js";

const ContactNumberInput = ({ contactNumber }) => {
	const { dispatch } = useContext(EventContext);

	return (
		<div className="relative flex items-center">
			<input
				className="w-full my-1"
				type="text"
				required
				minLength={9}
				maxLength={11}
				value={contactNumber.number}
				placeholder="e.g. 0137829473"
				onChange={(e) => {
					const contactNumberReg = /^\d+$/;
					if (contactNumberReg.test(e.target.value) || e.target.value === "") {
						dispatch({
							type: ACTION_TYPES.SET_CONTACT_NUMBER,
							payload: { id: contactNumber.id, number: e.target.value },
						});
					}
				}}
			/>
			{/* REMOVE ICON */}
			{contactNumber.id !== 0 && (
				<MdCancel
					className="absolute ml-2 text-3xl cursor-pointer text-red-600 hover:opacity-80 end-1"
					onClick={() =>
						dispatch({
							type: ACTION_TYPES.REMOVE_CONTACT_NUMBER,
							payload: contactNumber,
						})
					}
				/>
			)}
		</div>
	);
};

export default ContactNumberInput;
