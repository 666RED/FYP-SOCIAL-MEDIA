import { React, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner.jsx";
import Filter from "../Filter.jsx";
import FormHeader from "../FormHeader.jsx";
import Option from "./Option.jsx";
import { ServerContext } from "../../App.js";

const ReportForm = ({
	toggleShowReportForm,
	toggleShowOptionDiv = null,
	id,
	type = "Post",
}) => {
	const serverURL = useContext(ServerContext);
	const [loading, setLoading] = useState(false);
	const [optionValue, setOptionValue] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);

	const options = [
		{ name: "Offensive", value: "offensive", id: 0 },
		{ name: "Sexual inappropriate", value: "sexial-inappropriate", id: 1 },
		{ name: "False news", value: "false-news", id: 2 },
		{ name: "Violence", value: "violence", id: 3 },
		{ name: "Prohibited content", value: "prohibited-content", id: 4 },
		{ name: "Political issue", value: "political-issue", id: 5 },
		{ name: "Spam", value: "spam", id: 6 },
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const res = await fetch(`${serverURL}/admin/make-report`, {
				method: "POST",
				body: JSON.stringify({
					reporterId: user._id,
					targetId: id,
					reportType: type,
					reason: optionValue,
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
				enqueueSnackbar(
					`${
						type === "Post"
							? "Post reported"
							: type === "Group"
							? "Group reported"
							: type === "Group Post"
							? "Group post reported"
							: type === "Product"
							? "Product reported"
							: type === "Service"
							? "Service reported"
							: type === "Event"
							? "Event reported"
							: "Condition reported"
					}`,
					{ variant: "success" }
				);
				if (toggleShowOptionDiv) {
					toggleShowOptionDiv();
				}
				toggleShowReportForm();
			} else if (msg === "Fail to make report") {
				enqueueSnackbar("Fail to make report", { variant: "error" });
			} else if (msg === "Already made report") {
				enqueueSnackbar("Already made report", {
					variant: "warning",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <Spinner />}
			<Filter />
			<div className="center-container items-center">
				<form onSubmit={handleSubmit} className="form">
					{/* HEADER */}
					<FormHeader
						closeFunction={toggleShowReportForm}
						title={
							type === "Post"
								? "Report post"
								: type === "Group"
								? "Report group"
								: type === "Group Post"
								? "Report group post"
								: type === "Product"
								? "Report Product"
								: type === "Service"
								? "Report Service"
								: type === "Event"
								? "Report Event"
								: "Report Condition"
						}
					/>
					<h3>
						Problem of this{" "}
						{type === "Post"
							? "post"
							: type === "Group"
							? "group"
							: type === "Group Post"
							? "group post"
							: type === "Product"
							? "product"
							: type === "Service"
							? "service"
							: type === "Event"
							? "event"
							: "condition"}
						:
					</h3>
					{/* OPTIONS */}
					{options.map((option) => (
						<Option
							name={option.name}
							value={option.value}
							key={option.id}
							setOptionValue={setOptionValue}
						/>
					))}
					{/* SUBMIT BUTTON */}
					<button
						className="btn-green block w-1/2 md:w-1/3 mt-7 mx-auto"
						type="submit"
					>
						SUBMIT
					</button>
				</form>
			</div>
		</div>
	);
};

export default ReportForm;
