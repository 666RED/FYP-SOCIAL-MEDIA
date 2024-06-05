import { React, useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import JoinGroupRequest from "./JoinGroupRequest.jsx";
import LoadMoreButton from "../../../../../components/LoadMoreButton.jsx";
import {
	appendJoinGroupRequests,
	resetState,
	setHasJoinGroupRequest,
	setIsLoadingJoinGroupRequests,
	setJoinGroupRequestsArr,
} from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const JoinGroupRequestsList = () => {
	const sliceDispatch = useDispatch();
	const { groupId } = useParams();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const {
		joinGroupRequestsArr,
		hasJoinGroupRequest,
		isLoadingJoinGroupRequests,
	} = useSelector((store) => store.group);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	// fetch join group requests
	useEffect(() => {
		const fetchJoinGroupRequests = async () => {
			sliceDispatch(setIsLoadingJoinGroupRequests(true));
			const res = await fetch(
				`${serverURL}/join-group-request/get-join-group-requests?groupId=${groupId}&joinGroupRequestIds=${JSON.stringify(
					joinGroupRequestsArr.map((request) => request._id)
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
				sliceDispatch(setIsLoadingJoinGroupRequests(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnJoinGroupRequestsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setJoinGroupRequestsArr(returnJoinGroupRequestsArr));

				if (returnJoinGroupRequestsArr.length < 10) {
					sliceDispatch(setHasJoinGroupRequest(false));
				} else {
					sliceDispatch(setHasJoinGroupRequest(true));
				}
			} else if (msg === "Join group request not found") {
				enqueueSnackbar("Fail to retreive join group requests", {
					variant: "error",
				});
			} else if (msg === "No join group request") {
				sliceDispatch(setJoinGroupRequestsArr([]));
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingJoinGroupRequests(false));
			try {
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				sliceDispatch(setIsLoadingJoinGroupRequests(false));
			}
		};

		fetchJoinGroupRequests();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	const handleLoadMore = async (e) => {
		e.preventDefault();
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/join-group-request/get-join-group-requests?groupId=${groupId}&joinGroupRequestIds=${JSON.stringify(
					joinGroupRequestsArr.map((request) => request._id)
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

			const { msg, returnJoinGroupRequestsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendJoinGroupRequests(returnJoinGroupRequestsArr));

				if (returnJoinGroupRequestsArr.length < 10) {
					sliceDispatch(setHasJoinGroupRequest(false));
				} else {
					sliceDispatch(setHasJoinGroupRequest(true));
				}
			} else if (msg === "Join group request not found") {
				enqueueSnackbar("Fail to retrieve join group requests", {
					variant: "error",
				});
			} else if (msg === "No join group request") {
				sliceDispatch(setHasJoinGroupRequest(false));
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			setLoadMore(false);
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<div className="my-5">
			{isLoadingJoinGroupRequests ? (
				<Loader />
			) : joinGroupRequestsArr.length > 0 ? (
				<div className="grid grid-cols-12 gap-x-5 max-h-[33rem] overflow-y-auto">
					{/* JOIN GROUP REQUEST */}
					{joinGroupRequestsArr.map((joinGroupRequest) => (
						<JoinGroupRequest
							key={joinGroupRequest._id}
							joinGroupRequest={joinGroupRequest}
						/>
					))}
					<div className="col-span-12">
						{/* LOAD MORE BUTTON */}
						<LoadMoreButton
							handleLoadMore={handleLoadMore}
							hasComponent={hasJoinGroupRequest}
							isLoadingComponent={isLoadingJoinGroupRequests}
							loadMore={loadMore}
						/>
					</div>
				</div>
			) : (
				<h2 className="w-full text-center">No join group request</h2>
			)}
		</div>
	);
};

export default JoinGroupRequestsList;
