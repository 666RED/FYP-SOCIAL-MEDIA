import React from "react";

const EditText = ({ forInput }) => {
	return (
		<label
			htmlFor={forInput}
			className="text-lg text-blue-600 cursor-pointer hover:opacity-80"
		>
			Edit
		</label>
	);
};

export default EditText;
