import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import YourGroup from "./YourGroup.jsx";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import {
	setGroupsArr,
	resetState,
	setIsLoadingGroups,
} from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const YourGroups = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { groupsArr, isLoadingGroups } = useSelector((store) => store.group);
	const { enqueueSnackbar } = useSnackbar();

	// retrieve your groups
	useEffect(() => {
		const getYourGroups = async () => {
			try {
				sliceDispatch(setIsLoadingGroups(true));
				const res = await fetch(
					`${serverURL}/group/get-user-groups?userId=${user._id}`,
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

	return (
		<div className="mt-3 grid grid-cols-12 md:gap-x-5 max-h-[32rem] min-[500px]:max-h-[26rem] overflow-y-auto">
			{isLoadingGroups ? (
				<Loader />
			) : groupsArr.length !== 0 ? (
				groupsArr.map((group) => <YourGroup key={group._id} group={group} />)
			) : (
				<h2 className="col-span-12">No group</h2>
			)}
		</div>
	);
};

export default YourGroups;
