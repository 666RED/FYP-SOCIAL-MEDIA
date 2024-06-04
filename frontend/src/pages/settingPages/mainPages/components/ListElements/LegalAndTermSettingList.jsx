import { React, useState, useContext } from "react";
import SettingContainer from "../SettingContainer.jsx";
import { SettingContext } from "../../SettingMainPage.jsx";

const LegalAndTermSettingList = () => {
	const [expandList, setExpandList] = useState(false);
	const { option, setOption } = useContext(SettingContext);

	const list = [
		{
			title: "Term of service",
			id: 0,
			func: () => {
				if (option !== "Term of service") {
					setOption("Term of service");
				}
			},
		},
		{
			title: "Privacy policy",
			id: 1,
			func: () => {
				if (option !== "Privacy policy") {
					setOption("Privacy policy");
				}
			},
		},
	];

	return (
		<SettingContainer
			expandList={expandList}
			setExpandList={setExpandList}
			list={list}
			title="Legal and term"
			maxHeight="max-h-[6rem]"
		/>
	);
};

export default LegalAndTermSettingList;
