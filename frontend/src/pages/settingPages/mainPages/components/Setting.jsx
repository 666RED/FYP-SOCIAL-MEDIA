import { React, useContext } from "react";
import { SettingContext } from "../SettingMainPage.jsx";

const Setting = ({ title, func }) => {
	const { option, discardChanges, setDiscardChanges } =
		useContext(SettingContext);

	const handleOnClick = () => {
		if (option === title) {
			return;
		}

		if (discardChanges) {
			const ans = window.confirm("Discard changes?");
			if (ans) {
				setDiscardChanges(false);
				func();
			}
		} else {
			func();
		}
	};

	return (
		<li
			className={`p-2 m-1 cursor-pointer rounded-lg hover:opacity-70 ${
				option === title ? "bg-gray-300" : "bg-gray-200"
			}`}
			onClick={handleOnClick}
		>
			{title}
		</li>
	);
};

export default Setting;
