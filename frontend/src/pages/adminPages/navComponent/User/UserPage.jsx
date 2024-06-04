import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import UserHead from "./UserHead.jsx";
import UserRows from "./UserRows.jsx";
import { setSearchText } from "../../../../features/searchSlice.js";
import { ServerContext } from "../../../../App.js";
export const userContext = createContext(null);
let currentRequest;

const UserPage = () => {
	const sliceDispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [disableSearch, setDisableSearch] = useState(true);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const { searchText } = useSelector((store) => store.search);

	const [userRows, setUserRows] = useState([]);
	const [originalUserRows, setOriginalUserRows] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastUser = currentPage * 10;
	const indexOfFirstUser = indexOfLastUser - 10;
	const currentUsers = userRows.slice(indexOfFirstUser, indexOfLastUser);

	// get all users
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveUsers = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-users`, {
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

				const { msg, users } = await res.json();

				if (msg === "Success") {
					setUserRows(users);
					setOriginalUserRows(users);
				} else if (msg === "Fail to retrieve users") {
					enqueueSnackbar("Fail to retrieve users", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				setDisableSearch(false);
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

		retrieveUsers();

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
				`${serverURL}/admin/search-users?searchText=${payload.trim()}`,
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

			const { msg, users } = await res.json();

			if (msg === "Success") {
				setUserRows(users);
			} else if (msg === "Stop searching") {
				setUserRows(originalUserRows);
			} else if (msg === "Users not found") {
				enqueueSnackbar("Users not found", { variant: "error" });
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
				<userContext.Provider
					value={{ currentUsers, loading, indexOfFirstUser }}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2">User</h1>
						{/* SEARCH BAR */}
						<SearchBar
							func={handleOnChange}
							placeholderText="User name"
							text={searchText}
							isDisabled={disableSearch}
						/>
					</div>
					{/* TABLE */}
					<TableTemplate head={<UserHead />} body={<UserRows />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={userRows}
					/>
				</userContext.Provider>
			}
			selectedSection="User"
		/>
	);
};

export default UserPage;
