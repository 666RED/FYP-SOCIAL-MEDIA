import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import SideBar from "../../../../components/Sidebar/SideBar.jsx";
import Error from "../../../../components/Error.jsx";
import Header from "../../../../components/Header.jsx";
import YourGroups from "./component/YourGroups.jsx";
import DiscoverGroups from "./component/DiscoverGroups.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import { resetSearchText } from "../../../../features/searchSlice.js";

const GroupPage = () => {
	const navigate = useNavigate();
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const [loading, setLoading] = useState(false);
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [currentNav, setCurrentNav] = useState("Your groups");

	// reset searchText state
	useEffect(() => {
		return () => {
			sliceDispatch(resetSearchText());
		};
	}, []);

	const handleShowYourGroups = async () => {
		setCurrentNav("Your groups");
	};

	const handleShowDiscover = async () => {
		setCurrentNav("Discover");
	};

	const searchYourGroups = async () => {
		console.log("search your groups");
	};

	const searchDiscorverGroups = async () => {
		console.log("search discover groups");
	};

	return user && token ? (
		<div className="py-2">
			{loading && <Spinner />}
			{/* SIDEBAR */}
			{extendSideBar && (
				<SideBar selectedSection="Group" setExtendSideBar={setExtendSideBar} />
			)}
			{/* HEADER */}
			<Header
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				title="Group"
			/>
			{/* NAV BUTTONS */}
			<div className="px-2 mt-3 grid grid-cols-12 items-end">
				<div className="flex col-span-7 md:col-span-5">
					{/* YOUR GROUP NAV */}
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl ${
							currentNav === "Your groups" && "bg-gray-200 font-semibold"
						}`}
						onClick={currentNav === "Your gruops" ? null : handleShowYourGroups}
					>
						Your groups
					</p>
					{/* DISCOVER NEW GROUP NAV */}
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 flex-1 rounded-xl ${
							currentNav === "Discover" && "bg-gray-200 font-semibold"
						}`}
						onClick={currentNav === "Discover" ? null : handleShowDiscover}
					>
						Discover groups
					</p>
				</div>
				{/* CREATE NEW GROUP BUTTON */}
				<button
					className="btn-green col-start-9 col-span-4 md:col-start-11 md:col-span-2"
					onClick={() => navigate("/group/create-new-group")}
				>
					Create New
				</button>
			</div>
			{/* HORIZONTAL LINE */}
			<hr className="border-4 border-gray-400 my-3" />
			{/* MAIN CONTENT */}
			<div className="px-2">
				{/* SEARCH BAR */}
				<SearchBar
					func={
						currentNav === "Your grousp"
							? searchYourGroups
							: searchDiscorverGroups
					}
					placeholderText="Search group"
					text={searchText}
				/>
				{/* YOUR GROUPS */}
				{currentNav === "Your groups" ? <YourGroups /> : <DiscoverGroups />}
			</div>
		</div>
	) : (
		<Error />
	);
};

export default GroupPage;
