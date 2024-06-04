import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import EventHead from "./EventHead.jsx";
import EventRows from "./EventRows.jsx";
import { setSearchText } from "../../../../features/searchSlice.js";
import { ServerContext } from "../../../../App.js";
export const eventContext = createContext(null);
let currentRequest;

const EventPage = () => {
	const sliceDispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [disableSearch, setDisableSearch] = useState(true);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const { searchText } = useSelector((store) => store.search);

	const [eventRows, setEventRows] = useState([]);
	const [originalEventRows, setOriginalEventRows] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastEvent = currentPage * 10;
	const indexOfFirstEvent = indexOfLastEvent - 10;
	const currentEvents = eventRows.slice(indexOfFirstEvent, indexOfLastEvent);

	// get all products
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveEvents = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-events`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				});

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, events } = await res.json();

				if (msg === "Success") {
					setEventRows(events);
					setOriginalEventRows(events);
					setDisableSearch(false);
				} else if (msg === "Fail to retrieve events") {
					enqueueSnackbar("Fail to retrieve events", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
				}
				setLoading(false);
			}
		};

		retrieveEvents();

		return () => {
			currentRequest.abort();
			sliceDispatch(setSearchText(""));
		};
	}, []);

	const handleOnChange = async (payload) => {
		try {
			const abortController = new AbortController();
			const { signal } = abortController;

			if (currentRequest) {
				currentRequest.abort();
			}

			currentRequest = abortController;

			setLoading(true);
			sliceDispatch(setSearchText(payload));
			setCurrentPage(1);

			const res = await fetch(
				`${serverURL}/admin/search-events?searchText=${payload.trim()}`,
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
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, events } = await res.json();

			if (msg === "Success") {
				setEventRows(events);
			} else if (msg === "Stop searching") {
				setEventRows(originalEventRows);
			} else if (msg === "Events not found") {
				enqueueSnackbar("Events not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
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

	return (
		<PageTemplate
			component={
				<eventContext.Provider
					value={{ currentEvents, loading, indexOfFirstEvent }}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2 text-[20px] md:text-[30px]">
							Event
						</h1>
						{/* SEARCH BAR */}
						<SearchBar
							func={handleOnChange}
							placeholderText="Event name"
							text={searchText}
							isDisabled={disableSearch}
						/>
					</div>
					{/* TABLE */}
					<TableTemplate body={<EventRows />} head={<EventHead />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={eventRows}
					/>
				</eventContext.Provider>
			}
			selectedSection="Event"
		/>
	);
};

export default EventPage;
