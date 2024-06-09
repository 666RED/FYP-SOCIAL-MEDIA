import { React, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { capitalize } from "../../../../usefulFunction.js";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import ViewReport from "./ViewReport.jsx";
import { ServerContext } from "../../../../App.js";
import { reportContext } from "./ReportPage.jsx";

const ReportRow = ({ report, count }) => {
	const { user, token } = useSelector((store) => store.admin);
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const [showReport, setShowReport] = useState(false);
	const [loading, setLoading] = useState(false);
	let { setMadeDecision } = useContext(reportContext);

	const handleDismiss = async (e) => {
		e.preventDefault();
		const ans = window.confirm("Dismiss report?");
		if (ans) {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/dismiss-report`, {
					method: "PATCH",
					body: JSON.stringify({
						id: report._id,
						adminId: user._id,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Report dismissed", {
						variant: "success",
					});
					setMadeDecision((prev) => !prev);
				} else if (msg === "Fail to dismiss report") {
					enqueueSnackbar("Fail to dismiss report", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar(err, {
					variant: "error",
				});
				setLoading(false);
			}
		}
	};

	const handleRemove = async (e) => {
		e.preventDefault();
		const ans = window.confirm(`Remove ${report.type}?`);
		if (ans) {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/remove-report`, {
					method: "PATCH",
					body: JSON.stringify({
						id: report._id,
						type: report.type,
						targetId: report.targetId,
						adminId: user._id,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar(`${report.type} removed`, {
						variant: "success",
					});
					setMadeDecision((prev) => !prev);
				} else if (msg === "Fail to remove report") {
					enqueueSnackbar("Fail to remove report", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar(err, {
					variant: "error",
				});
				setLoading(false);
			}
		}
	};

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{report.reporter}</td>
			<td>{report.targetId}</td>
			<td>{report.type}</td>
			<td>{capitalize(report.reason)}</td>
			<td>{report.reported}</td>
			<td
				className={`text-center ${
					report.status === "Dismissed"
						? "text-green-600"
						: report.status === "Removed"
						? "text-red-600"
						: "text-blue-600"
				}`}
			>
				{report.status}
			</td>
			{/* OPERATIONS */}
			<td className="py-0">
				<button
					className="btn-blue operation-btn"
					onClick={() => setShowReport(true)}
				>
					View
				</button>
				{report.status === "Pending" && (
					<button
						className="btn-green operation-btn mx-2"
						onClick={handleDismiss}
					>
						Dismiss
					</button>
				)}

				{report.status === "Pending" && (
					<button className="btn-red operation-btn" onClick={handleRemove}>
						Remove
					</button>
				)}
			</td>
			{/* VIEW REPORT */}
			{showReport && (
				<ViewReport setShowReport={setShowReport} report={report} />
			)}
			{/* SPINNER */}
			{loading && <Spinner />}
		</tr>
	);
};

export default ReportRow;
