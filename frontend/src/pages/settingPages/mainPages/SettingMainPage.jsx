import { React, useEffect, useState, createContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SettingList from "./components/SettingList.jsx";
import Error from "../../../components/Error.jsx";
import SideBar from "../../../components/Sidebar/SideBar.jsx";
import Header from "../../../components/Header.jsx";
import ChangePassword from "./components/Options/ChangePassword.jsx";
import UpdatePersonalInfo from "./components/Options/UpdatePersonalInfo.jsx";
import FramePreference from "./components/Options/FramePreference.jsx";
import TermOfService from "./components/Options/TermOfService.jsx";
import PrivacyPolicy from "./components/Options/PrivacyPolicy.jsx";
import FQAs from "./components/Options/FAQs.jsx";
import VersionAndUpdate from "./components/Options/VersionAndUpdate.jsx";
export const SettingContext = createContext(null);

const SettingMainPage = () => {
	const { earlyUser } = useParams();
	const { user, token } = useSelector((store) => store.auth);
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [option, setOption] = useState("");
	const [discardChanges, setDiscardChanges] = useState(false);
	const mainContentRef = useRef(null);

	useEffect(() => {
		if (mainContentRef.current) {
			const wrapperTop = mainContentRef.current.offsetTop - 10;
			window.scrollTo({
				top: wrapperTop,
				behavior: "smooth",
			});
		}
	}, [option]);

	useEffect(() => {
		if (earlyUser == 1) {
			setOption("Frame preference");
		}
	}, []);

	return user && token ? (
		<div className="pt-2 pb-5">
			{/* SIDEBAR */}
			<SideBar
				selectedSection="Setting"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
			{/* HEADER */}
			<Header
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				title="Setting"
			/>
			{/* OPTION PANE & MAIN CONTENT */}
			<SettingContext.Provider
				value={{ option, setOption, discardChanges, setDiscardChanges }}
			>
				<div className="grid grid-cols-12 px-2 mt-3">
					{/* OPTION PANE */}
					<div className="col-span-12 md:col-span-3">
						<SettingList />
					</div>
					{/* HORIZONTAL LINE */}
					<hr
						className="col-span-12 h-1 border border-gray-600 bg-gray-600 mt-3 md:hidden"
						ref={mainContentRef}
					/>
					{/* MAIN CONTENT */}
					<div className="md:col-span-9 md:ml-3 col-span-12 mt-3 md:mt-0">
						{option === "Update personal information" ? (
							<UpdatePersonalInfo />
						) : option === "Frame preference" ? (
							<FramePreference />
						) : option === "Change password" ? (
							<ChangePassword />
						) : option === "Term of service" ? (
							<TermOfService />
						) : option === "Privacy policy" ? (
							<PrivacyPolicy />
						) : option === "FAQs" ? (
							<FQAs />
						) : option === "Version and update" ? (
							<VersionAndUpdate />
						) : (
							<div></div>
						)}
					</div>
				</div>
			</SettingContext.Provider>
		</div>
	) : (
		<Error />
	);
};

export default SettingMainPage;
