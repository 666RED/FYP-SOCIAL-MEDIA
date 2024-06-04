import React from "react";

const Option = ({ name, value, setOptionValue }) => {
	return (
		<div className="flex items-center my-2 ml-3">
			<input
				className="mr-2"
				type="radio"
				name="option"
				value={value}
				id={value}
				onChange={(e) => setOptionValue(e.target.value)}
				required
			/>
			<label htmlFor={value}>{name}</label>
		</div>
	);
};

export default Option;
