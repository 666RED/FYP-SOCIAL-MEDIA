import { React, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../../components/Sidebar/SideBar.jsx";
import Error from "../../../../components/Error.jsx";
import Header from "../../../../components/Header.jsx";
import YourGroups from "./component/YourGroups.jsx";
import DiscoverGroups from "./component/DiscoverGroups.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import {
	resetSearchText,
	setSearchText,
} from "../../../../features/searchSlice.js";
import {
	setGroupsArr,
	setHasGroups,
	setIsLoadingGroups,
	setRandomGroupsArr,
} from "../../../../features/groupSlice.js";
import { ServerContext } from "../../../../App.js";
let currentRequest;

const GroupPage = () => {
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const { originalGroupsArr, originalRandomGroupsArr } = useSelector(
		(store) => store.group
	);
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [currentNav, setCurrentNav] = useState("Your groups");
	const [loading, setLoading] = useState(false);

	// reset searchText state
	useEffect(() => {
		return () => {
			sliceDispatch(resetSearchText());
		};
	}, []);

	const handleShowYourGroups = () => {
		setCurrentNav("Your groups");
		sliceDispatch(resetSearchText());
	};

	const handleShowDiscover = () => {
		setCurrentNav("Discover groups");
		sliceDispatch(resetSearchText());
	};

	const searchYourGroups = async (payload) => {
		try {
			const abortController = new AbortController();
			const { signal } = abortController;

			// Cancel the previous request if it exists
			if (currentRequest) {
				currentRequest.abort();
			}

			// Store the current request to be able to cancel it
			currentRequest = abortController;

			sliceDispatch(setIsLoadingGroups(true));
			sliceDispatch(setSearchText(payload));

			const res = await fetch(
				`${serverURL}/group/get-user-groups-search?userId=${
					user._id
				}&searchText=${payload.trim()}&groupIds=${JSON.stringify([])}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				}
			);

			if (!res.ok && res.status === 403) {
				sliceDispatch(setIsLoadingGroups(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnUserGroupsArr } = await res.json();

			if (msg === "Success") {
				if (returnUserGroupsArr.length < 10) {
					sliceDispatch(setHasGroups(false));
				} else {
					sliceDispatch(setHasGroups(true));
				}

				sliceDispatch(setGroupsArr(returnUserGroupsArr));
			} else if (msg === "No group") {
				sliceDispatch(setHasGroups(false));
				sliceDispatch(setGroupsArr([]));
			} else if (msg === "Stop searching") {
				sliceDispatch(setGroupsArr(originalGroupsArr));
				if (originalGroupsArr.length >= 10) {
					sliceDispatch(setHasGroups(true));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingGroups(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	const searchDiscorverGroups = async (payload) => {
		try {
			const abortController = new AbortController();
			const { signal } = abortController;

			// Cancel the previous request if it exists
			if (currentRequest) {
				currentRequest.abort();
			}

			// Store the current request to be able to cancel it
			currentRequest = abortController;

			sliceDispatch(setIsLoadingGroups(true));
			sliceDispatch(setSearchText(payload));

			const res = await fetch(
				`${serverURL}/group/get-discover-groups-search?userId=${
					user._id
				}&searchText=${payload.trim()}&randomGroupIds=${JSON.stringify([])}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				}
			);

			if (!res.ok && res.status === 403) {
				sliceDispatch(setIsLoadingGroups(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnRandomGroupsArr } = await res.json();

			if (msg === "Success") {
				if (returnRandomGroupsArr.length < 10) {
					sliceDispatch(setHasGroups(false));
				} else {
					sliceDispatch(setHasGroups(true));
				}

				sliceDispatch(setRandomGroupsArr(returnRandomGroupsArr));
			} else if (msg === "No group") {
				sliceDispatch(setHasGroups(false));
				sliceDispatch(setRandomGroupsArr([]));
			} else if (msg === "Stop searching") {
				sliceDispatch(setRandomGroupsArr(originalRandomGroupsArr));
				if (originalRandomGroupsArr.length >= 10) {
					sliceDispatch(setHasGroups(true));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingGroups(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	return user && token ? (
		<div className="py-2">
			{/* SIDEBAR */}
			<SideBar
				selectedSection="Group"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
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
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-[13px] min-[361px]:text-base ${
							currentNav === "Your groups" && "bg-gray-200 font-semibold"
						}`}
						onClick={currentNav === "Your groups" ? null : handleShowYourGroups}
					>
						Your groups
					</p>
					{/* DISCOVER NEW GROUP NAV */}
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 flex-1 rounded-xl text-[13px] min-[361px]:text-base ${
							currentNav === "Discover groups" && "bg-gray-200 font-semibold"
						}`}
						onClick={
							currentNav === "Discover groups" ? null : handleShowDiscover
						}
					>
						Discover groups
					</p>
				</div>
				{/* CREATE NEW GROUP BUTTON */}
				<button
					className="btn-green col-start-9 col-span-4 md:col-start-11 md:col-span-2 text-[13px] min-[361px]:text-base"
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
						currentNav === "Your groups"
							? searchYourGroups
							: searchDiscorverGroups
					}
					placeholderText="Search group"
					text={searchText}
					isDisabled={loading}
				/>
				{/* YOUR GROUPS */}
				{currentNav === "Your groups" ? (
					<YourGroups setLoading={setLoading} />
				) : (
					<DiscoverGroups setLoading={setLoading} />
				)}
			</div>
		</div>
	) : (
		<Error />
	);
};

export default GroupPage;
