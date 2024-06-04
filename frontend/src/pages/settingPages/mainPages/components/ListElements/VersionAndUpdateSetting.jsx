import { React, useContext } from "react";
import { SettingContext } from "../../SettingMainPage.jsx";

const VersionAndUpdateSetting = () => {
	const { option, setOption, discardChanges, setDiscardChanges } =
		useContext(SettingContext);

	const handleOnClick = () => {
		if (discardChanges) {
			const ans = window.confirm("Discard changes?");
			if (ans) {
				setDiscardChanges(false);
				setOption("Version and update");
			}
		} else {
			setOption("Version and update");
		}
	};

	return (
		<div
			className={`border border-gray-400 rounded-lg mx-auto bg-white overflow-hidden p-2 hover:bg-gray-200 w-full cursor-pointer ${
				option === "Version and update" && "bg-gray-300"
			}`}
			onClick={handleOnClick}
		>
			Version and update
		</div>
	);
};

export default VersionAndUpdateSetting;
