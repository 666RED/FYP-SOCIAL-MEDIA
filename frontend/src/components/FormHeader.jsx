import React from "react";
import HorizontalRule from "./HorizontalRule.jsx";
import { MdCancel } from "react-icons/md";

const FormHeader = ({ title, closeFunction, discardChanges = false }) => {
	return (
		<div>
			<h1 className="text-center text-2xl md:text-3xl">{title}</h1>
			<MdCancel
				className="absolute text-3xl right-1 top-4 cursor-pointer text-red-600 hover:opacity-80"
				onClick={() => {
					if (!discardChanges) {
						closeFunction();
						return;
					}
					const ans = window.confirm("Discard changes?");
					if (ans) {
						closeFunction();
					}
				}}
			/>
			<HorizontalRule />
		</div>
	);
};

export default FormHeader;
