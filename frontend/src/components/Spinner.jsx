import React from "react";
import { Oval } from "react-loader-spinner";

const Spinner = () => {
	return (
		<div className="z-30 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black opacity-75">
			<Oval />
		</div>
	);
};

export default Spinner;
