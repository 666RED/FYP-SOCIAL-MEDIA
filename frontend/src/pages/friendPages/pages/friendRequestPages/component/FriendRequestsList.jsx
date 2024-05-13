import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import FriendRequest from "./FriendRequest.jsx";
import {
	setFriendRequestsArr,
	setHasFriendRequests,
	setIsLoadingFriendRequests,
} from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";
let currentRequest;

const FriendRequestsList = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendRequestsArr, isLoadingFriendRequests } = useSelector(
		(store) => store.friend
	);
	const { enqueueSnackbar } = useSnackbar();

	// retrieve requests
	useEffect(() => {
		const retrieveFriendRequests = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;
				currentRequest = abortController;

				sliceDispatch(setIsLoadingFriendRequests(true));
				const res = await fetch(
					`${serverURL}/friend-request/get-friend-requests?receiverId=${
						user._id
					}&requestsArr=${JSON.stringify([])}`,
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
					sliceDispatch(setIsLoadingFriendRequests(false));

					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnFriendRequests } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setFriendRequestsArr(returnFriendRequests));
					if (returnFriendRequests.length < 10) {
						sliceDispatch(setHasFriendRequests(false));
					} else {
						sliceDispatch(setHasFriendRequests(true));
					}
				} else if (msg === "Friend requests not found") {
					enqueueSnackbar("Friend requests not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				sliceDispatch(setIsLoadingFriendRequests(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					sliceDispatch(setIsLoadingFriendRequests(false));
				}
			}
		};

		retrieveFriendRequests();
	}, []);

	// cancel request
	useEffect(() => {
		return () => {
			if (currentRequest) {
				currentRequest.abort();
			}
		};
	}, []);

	return (
		<div className="my-5 grid grid-cols-12 gap-x-5">
			{isLoadingFriendRequests ? (
				<div className="col-span-12">
					<Loader />
				</div>
			) : friendRequestsArr.length > 0 ? (
				friendRequestsArr.map((friendRequest) => (
					<FriendRequest
						key={friendRequest._id}
						friendRequest={friendRequest}
					/>
				))
			) : (
				<h2 className="mt-5 col-span-12 text-center">No friend request</h2>
			)}
		</div>
	);
};

export default FriendRequestsList;
