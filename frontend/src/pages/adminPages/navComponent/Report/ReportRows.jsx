import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import ReportRow from "./ReportRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { reportContext } from "./ReportPage.jsx";

const ReportRows = () => {
	const { currentReports, loading, indexOfFirstReport } =
		useContext(reportContext);

	return loading ? (
		<Loader />
	) : currentReports.length > 0 ? (
		currentReports.map((report, index) => (
			<ReportRow
				report={report}
				key={report._id}
				count={indexOfFirstReport + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default ReportRows;
