import React from "react";
import { MdCancel } from "react-icons/md";
import ReportGroup from "./ReportType/ReportGroup.jsx";
import ReportPost from "./ReportType/ReportPost.jsx";
import ReportCondition from "./ReportType/ReportCondition.jsx";
import ReportProduct from "./ReportType/ReportProduct.jsx";
import ReportService from "./ReportType/ReportService.jsx";
import ReportEvent from "./ReportType/ReportEvent.jsx";

const ViewReport = ({ setShowReport, report }) => {
	return (
		<div className="center-container items-center flex-col md:flex-row py-2 px-2 bg-black bg-opacity-75">
			<div className="bg-white rounded-xl relative p-2 overflow-auto md:w-1/2 w-full">
				{/* TITLE */}
				<p className="text-center text-3xl font-semibold">View {report.type}</p>
				<hr className="border-2 border-gray-300 bg-gray-300 mt-2 mb-4" />
				{/* MAIN CONTENT */}
				{report.type === "Group" ? (
					<ReportGroup target={report.target} />
				) : report.type === "Post" ? (
					<ReportPost target={report.target} type={report.type} />
				) : report.type === "Group Post" ? (
					<ReportPost target={report.target} type={report.type} />
				) : report.type === "Condition" ? (
					<ReportCondition target={report.target} />
				) : report.type === "Product" ? (
					<ReportProduct target={report.target} />
				) : report.type === "Service" ? (
					<ReportService target={report.target} />
				) : (
					<ReportEvent target={report.target} />
				)}
				{/* CANCEL ICON */}
				<MdCancel
					className="absolute text-3xl right-2 top-3 cursor-pointer text-red-600 hover:opacity-80"
					onClick={() => setShowReport(false)}
				/>
			</div>
		</div>
	);
};

export default ViewReport;
