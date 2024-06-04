import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import ConditionHead from "./ConditionHead.jsx";
import ConditionRows from "./ConditionRows.jsx";
import { setSearchText } from "../../../../features/searchSlice.js";
import { ServerContext } from "../../../../App.js";
export const conditionContext = createContext(null);
let currentRequest;

const ConditionPage = () => {
	const sliceDispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [disableSearch, setDisableSearch] = useState(true);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const { searchText } = useSelector((store) => store.search);

	const [conditionRows, setConditionRows] = useState([]);
	const [originalConditionRows, setOriginalConditionRows] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastCondition = currentPage * 10;
	const indexOfFirstCondition = indexOfLastCondition - 10;
	const currentConditions = conditionRows.slice(
		indexOfFirstCondition,
		indexOfLastCondition
	);

	// get all conditions
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveConditions = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-conditions`, {
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

				const { msg, conditions } = await res.json();

				if (msg === "Success") {
					setConditionRows(conditions);
					setOriginalConditionRows(conditions);
					setDisableSearch(false);
				} else if (msg === "Fail to retrieve conditions") {
					enqueueSnackbar("Fail to retrieve conditions", {
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

		retrieveConditions();

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
				`${serverURL}/admin/search-conditions?searchText=${payload.trim()}`,
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

			const { msg, conditions } = await res.json();

			if (msg === "Success") {
				setConditionRows(conditions);
			} else if (msg === "Stop searching") {
				setConditionRows(originalConditionRows);
			} else if (msg === "Conditions not found") {
				enqueueSnackbar("Conditions not found", { variant: "error" });
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
				<conditionContext.Provider
					value={{ currentConditions, loading, indexOfFirstCondition }}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2 text-[20px] md:text-[30px]">
							Campus Condition
						</h1>
						{/* SEARCH BAR */}
						<SearchBar
							func={handleOnChange}
							placeholderText="Condition title"
							text={searchText}
							isDisabled={disableSearch}
						/>
					</div>
					{/* TABLE */}
					<TableTemplate body={<ConditionRows />} head={<ConditionHead />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={conditionRows}
					/>
				</conditionContext.Provider>
			}
			selectedSection="Campus Condition"
		/>
	);
};

export default ConditionPage;
