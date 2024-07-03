import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import Pending from "../component/Pending.jsx";
import {
	setHasPendings,
	setIsLoadingPendings,
	setPendingsArr,
} from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";
let currentRequest;

const PendingList = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { pendingsArr, isLoadingPendings } = useSelector(
		(store) => store.friend
	);
	const { enqueueSnackbar } = useSnackbar();

	// get pendings
	useEffect(() => {
		const retrievePendings = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;
				currentRequest = abortController;

				sliceDispatch(setIsLoadingPendings(true));
				const res = await fetch(
					`${serverURL}/friend-request/get-pending-friend-requests?requestorId=${
						user._id
					}&pendingIds=${JSON.stringify([])}`,
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
					sliceDispatch(setIsLoadingPendings(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnFriendRequests } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setPendingsArr(returnFriendRequests));
					if (returnFriendRequests.length < 10) {
						sliceDispatch(setHasPendings(false));
					} else {
						sliceDispatch(setHasPendings(true));
					}
				} else if (msg === "Friend requests not found") {
					enqueueSnackbar("Friend requests not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				sliceDispatch(setIsLoadingPendings(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					sliceDispatch(setIsLoadingPendings(false));
				}
			}
		};

		retrievePendings();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			if (currentRequest) {
				currentRequest.abort();
			}
		};
	}, []);

	return (
		<div className="grid grid-cols-12 gap-x-5">
			{isLoadingPendings ? (
				<div className="col-span-12 mt-4">
					<Loader />
				</div>
			) : pendingsArr.length > 0 ? (
				pendingsArr.map((pending) => (
					<Pending key={pending._id} pending={pending} />
				))
			) : (
				<h2 className="mt-5 col-span-12 text-center">
					No pending friend request
				</h2>
			)}
		</div>
	);
};

export default PendingList;
