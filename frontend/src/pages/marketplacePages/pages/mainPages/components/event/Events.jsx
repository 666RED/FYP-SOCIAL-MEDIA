import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../../components/Spinner/Loader.jsx";
import Event from "./Event.jsx";
import LoadMoreButton from "../../../../../../components/LoadMoreButton.jsx";
import {
	setEventsArr,
	addEventsArr,
	setHasEvents,
	setIsLoadingEvents,
	resetState,
	setOriginalEventsArr,
} from "../../../../../../features/eventSlice.js";
let currentRequest;

const Events = ({ getEventPath, searchEventPath, setLoading }) => {
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const { eventsArr, hasEvents, isLoadingEvents, eventCategory } = useSelector(
		(store) => store.event
	);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${getEventPath}?userId=${user._id}&eventsArr=${JSON.stringify(
					eventsArr
				)}&category=${eventCategory}`,
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

			const { msg, returnEvents } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addEventsArr(returnEvents));
				if (returnEvents.length < 15) {
					sliceDispatch(setHasEvents(false));
				}
			} else if (msg === "Events not found") {
				enqueueSnackbar("Events not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	const handleLoadMoreSearch = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${searchEventPath}?userId=${
					user._id
				}&searchText=${searchText}&eventsArr=${JSON.stringify(
					eventsArr
				)}&category=${eventCategory}`,
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

			const { msg, returnEvents } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addEventsArr(returnEvents));
				if (returnEvents.length < 15) {
					sliceDispatch(setHasEvents(false));
				}
			} else if (msg === "Fail to retrieve events") {
				enqueueSnackbar("Fail to retrieve events", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	// get events
	useEffect(() => {
		const getEvents = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;

				if (currentRequest) {
					currentRequest.abort();
				}

				currentRequest = abortController;

				setLoading(true);
				sliceDispatch(setIsLoadingEvents(true));

				const res = await fetch(
					`${getEventPath}?userId=${user._id}&eventsArr=${JSON.stringify(
						[]
					)}&category=${eventCategory}`,
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
					sliceDispatch(setIsLoadingEvents(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnEvents } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setEventsArr(returnEvents));
					sliceDispatch(setOriginalEventsArr(returnEvents));
					if (returnEvents.length < 15) {
						sliceDispatch(setHasEvents(false));
					} else {
						sliceDispatch(setHasEvents(true));
					}
				} else if (msg === "Events not found") {
					enqueueSnackbar("Events not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				sliceDispatch(setIsLoadingEvents(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
					setLoading(false);
					sliceDispatch(setIsLoadingEvents(true));
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					setLoading(false);
					sliceDispatch(setIsLoadingEvents(false));
				}
			}
		};

		getEvents();
	}, [getEventPath, eventCategory]);

	// cancel request
	useEffect(() => {
		return () => {
			if (currentRequest) {
				currentRequest.abort();
			}
		};
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, [getEventPath]);

	return (
		<div className="mt-3">
			{isLoadingEvents ? (
				<Loader />
			) : eventsArr.length > 0 ? (
				<div className="grid grid-cols-12 gap-2 px-2 max-h-[30rem] overflow-y-auto min-[500px]:max-h-[23.5rem] mb-2">
					{eventsArr.map((event) => (
						<Event key={event._id} event={event} />
					))}
					<div className="col-span-12">
						<LoadMoreButton
							handleLoadMore={
								searchText === "" ? handleLoadMore : handleLoadMoreSearch
							}
							hasComponent={hasEvents}
							isLoadingComponent={isLoadingEvents}
							loadMore={loadMore}
						/>
					</div>
				</div>
			) : (
				<h2>No event</h2>
			)}
		</div>
	);
};

export default Events;
