import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import ServiceHead from "./ServiceHead.jsx";
import ServiceRows from "./ServiceRows.jsx";
import { setSearchText } from "../../../../features/searchSlice.js";
import { ServerContext } from "../../../../App.js";
export const serviceContext = createContext(null);
let currentRequest;

const ServicePage = () => {
	const sliceDispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [disableSearch, setDisableSearch] = useState(true);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const { searchText } = useSelector((store) => store.search);

	const [serviceRows, setServiceRows] = useState([]);
	const [originalServiceRows, setOriginalServiceRows] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastService = currentPage * 10;
	const indexOfFirstService = indexOfLastService - 10;
	const currentServices = serviceRows.slice(
		indexOfFirstService,
		indexOfLastService
	);

	// get all services
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveServices = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-services`, {
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

				const { msg, services } = await res.json();

				if (msg === "Success") {
					setServiceRows(services);
					setOriginalServiceRows(services);
					setDisableSearch(false);
				} else if (msg === "Fail to retrieve services") {
					enqueueSnackbar("Fail to retrieve services", {
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

		retrieveServices();

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
				`${serverURL}/admin/search-services?searchText=${payload.trim()}`,
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

			const { msg, services } = await res.json();

			if (msg === "Success") {
				setServiceRows(services);
			} else if (msg === "Stop searching") {
				setServiceRows(originalServiceRows);
			} else if (msg === "Services not found") {
				enqueueSnackbar("Services not found", { variant: "error" });
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
				<serviceContext.Provider
					value={{ currentServices, loading, indexOfFirstService }}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2 text-[20px] md:text-[30px]">
							Service
						</h1>
						{/* SEARCH BAR */}
						<SearchBar
							func={handleOnChange}
							placeholderText="Service name"
							text={searchText}
							isDisabled={disableSearch}
						/>
					</div>
					{/* TABLE */}
					<TableTemplate body={<ServiceRows />} head={<ServiceHead />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={serviceRows}
					/>
				</serviceContext.Provider>
			}
			selectedSection="Service"
		/>
	);
};

export default ServicePage;
