import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import DiscoverGroup from "./DiscoverGroup.jsx";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import LoadMoreButton from "../../../../../components/LoadMoreButton.jsx";
import {
	resetState,
	setRandomGroupsArr,
	setIsLoadingGroups,
	setOriginalRandomGroupsArr,
	appendRandomGroups,
	setHasGroups,
} from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const DiscoverGroups = ({ setLoading }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const { randomGroupsArr, isLoadingGroups, hasGroups } = useSelector(
		(store) => store.group
	);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	// retrieve discover groups
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const getDiscoverGroups = async () => {
			try {
				setLoading(true);
				sliceDispatch(setIsLoadingGroups(true));
				const res = await fetch(
					`${serverURL}/group/get-discover-groups?userId=${
						user._id
					}&randomGroupIds=${JSON.stringify(
						randomGroupsArr.map((group) => group._id)
					)}`,
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
					setLoading(false);
					sliceDispatch(setIsLoadingGroups(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnRandomGroupsArr } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setRandomGroupsArr(returnRandomGroupsArr));
					sliceDispatch(setOriginalRandomGroupsArr(returnRandomGroupsArr));

					if (returnRandomGroupsArr.length < 10) {
						sliceDispatch(setHasGroups(false));
					} else {
						sliceDispatch(setHasGroups(true));
					}
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else if (msg === "Fail to find groups") {
					enqueueSnackbar("Fail to find groups", {
						variant: "error",
					});
				} else if (msg === "No group") {
					sliceDispatch(setRandomGroupsArr([]));
					sliceDispatch(setHasGroups(false));
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				sliceDispatch(setIsLoadingGroups(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request aborted");
					setLoading(false);
					sliceDispatch(setIsLoadingGroups(true));
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					setLoading(false);
					sliceDispatch(setIsLoadingGroups(false));
				}
			}
		};

		getDiscoverGroups();

		// reset state and abort request
		return () => {
			abortController.abort();
			sliceDispatch(resetState());
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/group/get-discover-groups?userId=${
					user._id
				}&randomGroupIds=${JSON.stringify(
					randomGroupsArr.map((group) => group._id)
				)}`,
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

			const { msg, returnRandomGroupsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendRandomGroups(returnRandomGroupsArr));
				if (returnRandomGroupsArr.length < 10) {
					sliceDispatch(setHasGroups(false));
				} else {
					sliceDispatch(setHasGroups(true));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", {
					variant: "error",
				});
			} else if (msg === "No group") {
				sliceDispatch(setHasGroups(false));
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

	const handleLoadMoreSearch = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/group/get-discover-groups-search?userId=${
					user._id
				}&randomGroupIds=${JSON.stringify(
					randomGroupsArr.map((group) => group._id)
				)}&searchText=${searchText}`,
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

			const { msg, returnRandomGroupsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendRandomGroups(returnRandomGroupsArr));
				if (returnRandomGroupsArr.length < 10) {
					sliceDispatch(setHasGroups(false));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", {
					variant: "error",
				});
			} else if (msg === "No group") {
				sliceDispatch(setRandomGroupsArr([]));
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
			) : randomGroupsArr.length !== 0 ? (
				<div className="mt-3 grid grid-cols-12 md:gap-x-5 max-h-[32rem] min-[500px]:max-h-[26rem] overflow-y-auto">
					{randomGroupsArr.map((group) => (
						<DiscoverGroup key={group._id} group={group} />
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

export default DiscoverGroups;
