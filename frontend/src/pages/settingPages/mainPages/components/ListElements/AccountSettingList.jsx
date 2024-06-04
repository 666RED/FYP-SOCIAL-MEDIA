import { React, useState, useContext } from "react";
import SettingContainer from "../SettingContainer.jsx";
import { SettingContext } from "../../SettingMainPage.jsx";

const AccountSettingList = () => {
	const [expandList, setExpandList] = useState(false);
	const { option, setOption } = useContext(SettingContext);

	const list = [
		{
			title: "Update personal information",
			id: 0,
			func: () => {
				if (option !== "Update personal information") {
					setOption("Update personal information");
				}
			},
		},
		{
			title: "Frame preference",
			id: 1,
			func: () => {
				if (option !== "Frame preference") {
					setOption("Frame preference");
				}
			},
		},
		{
			title: "Change password",
			id: 2,
			func: () => {
				if (option !== "Change password") {
					setOption("Change password");
				}
			},
		},
	];

	return (
		<SettingContainer
			expandList={expandList}
			setExpandList={setExpandList}
			list={list}
			title="Account setting"
			maxHeight="max-h-[10rem]"
		/>
	);
};

export default AccountSettingList;
