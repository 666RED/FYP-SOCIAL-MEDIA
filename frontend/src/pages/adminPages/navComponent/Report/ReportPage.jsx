import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import ReportHead from "./ReportHead.jsx";
import ReportRows from "./ReportRows.jsx";
import { ServerContext } from "../../../../App.js";
export const reportContext = createContext(null);
let currentRequest;

const ReportPage = () => {
	const [loading, setLoading] = useState(false);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);

	const [reportRows, setReportRows] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastReport = currentPage * 10;
	const indexOfFirstReport = indexOfLastReport - 10;
	const currentReports = reportRows.slice(
		indexOfFirstReport,
		indexOfLastReport
	);
	const [madeDecision, setMadeDecision] = useState(false);

	// get all reports
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveReports = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-reports`, {
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

				const { msg, reports } = await res.json();

				if (msg === "Success") {
					setReportRows(reports);
				} else if (msg === "Fail to retrieve reports") {
					enqueueSnackbar("Fail to retrieve reports", {
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

		retrieveReports();

		return () => {
			currentRequest.abort();
		};
	}, [madeDecision]);

	return (
		<PageTemplate
			component={
				<reportContext.Provider
					value={{
						currentReports,
						loading,
						indexOfFirstReport,
						setMadeDecision,
					}}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2">Report</h1>
					</div>
					{/* TABLE */}
					<TableTemplate body={<ReportRows />} head={<ReportHead />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={reportRows}
					/>
				</reportContext.Provider>
			}
			selectedSection="Report"
		/>
	);
};

export default ReportPage;
