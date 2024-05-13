import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import ACTION_TYPES from "./actionTypes/editEventActionTypes.js";

const AddNewContactNumber = ({ state, dispatch }) => {
	const handleAddContactNumber = (e) => {
		e.preventDefault();
		dispatch({
			type: ACTION_TYPES.ADD_CONTACT_NUMBER,
			payload: { id: state.count, number: "" },
		});
	};

	return (
		<button
			className="btn-blue mt-3 flex items-center text-sm ms:text-base"
			onClick={handleAddContactNumber}
		>
			<CiCirclePlus className="mr-2 text-xl" />
			Contact number
		</button>
	);
};

export default AddNewContactNumber;
