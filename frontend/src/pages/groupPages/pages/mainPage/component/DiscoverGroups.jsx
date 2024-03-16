import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import DiscoverGroup from "./DiscoverGroup.jsx";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import {
	resetState,
	setRandomGroupsArr,
	setIsLoadingGroups,
} from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const DiscoverGroups = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { randomGroupsArr, isLoadingGroups } = useSelector(
		(store) => store.group
	);
	const { enqueueSnackbar } = useSnackbar();

	// retrieve discover groups
	useEffect(() => {
		const getDiscoverGroups = async () => {
			try {
				sliceDispatch(setIsLoadingGroups(true));
				const res = await fetch(
					`${serverURL}/group/get-discover-groups?userId=${
						user._id
					}&randomGroupsArr=${JSON.stringify(randomGroupsArr)}`,
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

				const { msg, groups } = await res.json();
				if (msg === "Success") {
					sliceDispatch(setRandomGroupsArr(groups));
				} else if (msg === "Fail to find groups") {
					enqueueSnackbar("Fail to find groups", {
						variant: "error",
					});
				} else if (msg === "No group") {
					sliceDispatch(setRandomGroupsArr([]));
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

		getDiscoverGroups();
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
			) : randomGroupsArr.length !== 0 ? (
				randomGroupsArr.map((group) => (
					<DiscoverGroup key={group._id} group={group} />
				))
			) : (
				<h2 className="col-span-12">No group</h2>
			)}
		</div>
	);
};

export default DiscoverGroups;
