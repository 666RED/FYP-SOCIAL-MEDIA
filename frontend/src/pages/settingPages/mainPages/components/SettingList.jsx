import React from "react";
import AccountSettingList from "./ListElements/AccountSettingList.jsx";
import FAQsSetting from "./ListElements/FAQsSetting.jsx";
import LegalAndTermSettingList from "./ListElements/LegalAndTermSettingList.jsx";
import VersionAndUpdateSetting from "./ListElements/VersionAndUpdateSetting.jsx";

const SettingList = () => {
	return (
		<div className="flex flex-col gap-y-2 ">
			<AccountSettingList />
			<LegalAndTermSettingList />
			<FAQsSetting />
			<VersionAndUpdateSetting />
		</div>
	);
};

export default SettingList;
