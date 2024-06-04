import { React, useContext } from "react";
import { SettingContext } from "../../SettingMainPage.jsx";

const FAQsSetting = () => {
	const { option, setOption, discardChanges, setDiscardChanges } =
		useContext(SettingContext);

	const handleOnClick = () => {
		if (discardChanges) {
			const ans = window.confirm("Discard changes?");
			if (ans) {
				setDiscardChanges(false);
				setOption("FAQs");
			}
		} else {
			setOption("FAQs");
		}
	};

	return (
		<div
			className={`border border-gray-400 rounded-lg mx-auto bg-white overflow-hidden p-2 hover:bg-gray-200 w-full cursor-pointer ${
				option === "FAQs" && "bg-gray-300"
			}`}
			onClick={handleOnClick}
		>
			FAQs
		</div>
	);
};

export default FAQsSetting;
