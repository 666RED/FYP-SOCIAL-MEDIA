import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import GroupHead from "./GroupHead.jsx";
import GroupRows from "./GroupRows.jsx";
import { setSearchText } from "../../../../features/searchSlice.js";
import { ServerContext } from "../../../../App.js";
export const groupContext = createContext(null);
let currentRequest;

const GroupPage = () => {
	const sliceDispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [disableSearch, setDisableSearch] = useState(true);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const { searchText } = useSelector((store) => store.search);

	const [groupRows, setGroupRows] = useState([]);
	const [originalGroupRows, setOriginalGroupRows] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastGroup = currentPage * 10;
	const indexOfFirstGroup = indexOfLastGroup - 10;
	const currentGroups = groupRows.slice(indexOfFirstGroup, indexOfLastGroup);

	// get all groups
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveGroups = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-groups`, {
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

				const { msg, groups } = await res.json();

				if (msg === "Success") {
					setGroupRows(groups);
					setOriginalGroupRows(groups);
					setDisableSearch(false);
				} else if (msg === "Fail to retrieve groups") {
					enqueueSnackbar("Fail to retrieve groups", {
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

		retrieveGroups();

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
				`${serverURL}/admin/search-groups?searchText=${payload.trim()}`,
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

			const { msg, groups } = await res.json();

			if (msg === "Success") {
				setGroupRows(groups);
			} else if (msg === "Stop searching") {
				setGroupRows(originalGroupRows);
			} else if (msg === "Groups not found") {
				enqueueSnackbar("Groups not found", { variant: "error" });
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
				<groupContext.Provider
					value={{ currentGroups, loading, indexOfFirstGroup }}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2">Group</h1>
						{/* SEARCH BAR */}
						<SearchBar
							func={handleOnChange}
							placeholderText="Group name"
							text={searchText}
							isDisabled={disableSearch}
						/>
					</div>
					{/* TABLE */}
					<TableTemplate head={<GroupHead />} body={<GroupRows />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={groupRows}
					/>
				</groupContext.Provider>
			}
			selectedSection="Group"
		/>
	);
};

export default GroupPage;
