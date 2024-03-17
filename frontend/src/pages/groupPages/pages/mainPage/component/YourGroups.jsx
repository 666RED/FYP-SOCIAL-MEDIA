import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import YourGroup from "./YourGroup.jsx";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import LoadMoreButton from "../../../../../components/LoadMoreButton.jsx";
import {
	setGroupsArr,
	resetState,
	setIsLoadingGroups,
	appendGroups,
	setHasGroups,
} from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const YourGroups = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const { groupsArr, isLoadingGroups, hasGroups } = useSelector(
		(store) => store.group
	);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	// retrieve your groups
	useEffect(() => {
		const getYourGroups = async () => {
			try {
				sliceDispatch(setIsLoadingGroups(true));
				const res = await fetch(
					`${serverURL}/group/get-user-groups?userId=${
						user._id
					}&groupsArr=${JSON.stringify(groupsArr)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					sliceDispatch(setIsLoadingGroups(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, userGroupsArr } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setGroupsArr(userGroupsArr));
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else if (msg === "No group") {
					sliceDispatch(setGroupsArr([]));
				} else if (msg === "Group not found") {
					enqueueSnackbar("Group not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				sliceDispatch(setIsLoadingGroups(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				sliceDispatch(setIsLoadingGroups(false));
			}
		};

		getYourGroups();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/group/get-user-groups?userId=${
					user._id
				}&groupsArr=${JSON.stringify(groupsArr)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, userGroupsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendGroups(userGroupsArr));
				if (userGroupsArr.length < 10) {
					sliceDispatch(setHasGroups(false));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", {
					variant: "error",
				});
			} else if (msg === "No group") {
				sliceDispatch(setGroupsArr([]));
			} else if (msg === "Group not found") {
				enqueueSnackbar("Group not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(true);
		}
	};

	// change later
	const handleLoadMoreSearch = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/group/get-user-groups-search?userId=${
					user._id
				}&groupsArr=${JSON.stringify(groupsArr)}&searchText=${searchText}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, userGroupsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendGroups(userGroupsArr));
				if (userGroupsArr.length < 10) {
					sliceDispatch(setHasGroups(false));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", {
					variant: "error",
				});
			} else if (msg === "No group") {
				sliceDispatch(setGroupsArr([]));
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(true);
		}
	};

	return (
		<div className="mt-2">
			{isLoadingGroups ? (
				<Loader />
			) : groupsArr.length !== 0 ? (
				<div className="mt-3 grid grid-cols-12 md:gap-x-5 max-h-[32rem] min-[500px]:max-h-[26rem] overflow-y-auto">
					{groupsArr.map((group) => (
						<YourGroup key={group._id} group={group} />
					))}
					{/* LOAD MORE BUTTON */}
					<div className="col-span-12">
						<LoadMoreButton
							handleLoadMore={
								searchText === "" ? handleLoadMore : handleLoadMoreSearch
							}
							hasComponent={hasGroups}
							isLoadingComponent={isLoadingGroups}
							loadMore={loadMore}
						/>
					</div>
				</div>
			) : (
				<h2 className="col-span-12">No group</h2>
			)}
		</div>
	);
};

export default YourGroups;
