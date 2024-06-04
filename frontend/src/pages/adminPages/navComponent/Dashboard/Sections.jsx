import React, { useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaUser, FaSchool } from "react-icons/fa";
import { FaUserGroup, FaPen } from "react-icons/fa6";
import {
	MdOutlineProductionQuantityLimits,
	MdHomeRepairService,
	MdEventNote,
	MdOutlineReportGmailerrorred,
} from "react-icons/md";
import Section from "./Section.jsx";
import Loader from "../../../../components/Spinner/Loader.jsx";
import { ServerContext } from "../../../../App.js";

const Sections = () => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const serverURL = useContext(ServerContext);
	const [sections, setSections] = useState([]);
	const [loading, setLoading] = useState(false);

	// retrieve data
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		let currentRequest = abortController;

		const retrieveData = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${serverURL}/admin/retrieve-data`, {
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

				const { msg, data } = await res.json();

				if (msg === "Success") {
					const {
						countUser,
						countGroup,
						countCampusCondition,
						countProduct,
						countService,
						countEvent,
						countReport,
					} = data;

					setSections([
						{
							title: "user",
							total: countUser,
							icon: <FaUser />,
							action: () => navigate("/admin/user"),
						},
						{
							title: "group",
							total: countGroup,
							icon: <FaUserGroup />,
							action: () => navigate("/admin/group"),
						},
						{
							title: "condition",
							total: countCampusCondition,
							icon: <FaSchool />,
							action: () => navigate("/admin/condition"),
						},
						{
							title: "product",
							total: countProduct,
							icon: <MdOutlineProductionQuantityLimits />,
							action: () => navigate("/admin/product"),
						},
						{
							title: "service",
							total: countService,
							icon: <MdHomeRepairService />,
							action: () => navigate("/admin/service"),
						},
						{
							title: "event",
							total: countEvent,
							icon: <MdEventNote />,
							action: () => navigate("/admin/event"),
						},
						{
							title: "report",
							total: countReport,
							icon: <MdOutlineReportGmailerrorred />,
							action: () => navigate("/admin/report"),
						},
					]);
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

		retrieveData();

		return () => {
			currentRequest.abort();
		};
	}, []);

	return loading ? (
		<Loader />
	) : (
		<div className="grid grid-cols-12 gap-7 mb-3">
			{sections.map((section, id) => (
				<Section section={section} key={id} />
			))}
		</div>
	);
};

export default Sections;
