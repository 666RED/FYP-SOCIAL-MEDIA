import { React, useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "../../../../components/Spinner/Loader.jsx";
import CampusCondition from "../mainPage/components/CampusCondition.jsx";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import { ServerContext } from "../../../../App.js";

const ViewMostUsefulCondition = () => {
	const { conditionId } = useParams();
	const [mostUsefulCondition, setMostUsefulCondition] = useState({});
	const [loading, setLoading] = useState(false);
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const getMostUsefulCondition = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/campus-condition/get-most-useful-condition?conditionId=${conditionId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnCondition } = await res.json();

				if (msg === "Success") {
					setMostUsefulCondition(returnCondition);
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Condition not found", { variant: "error" });
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
		getMostUsefulCondition();
	}, []);

	return (
		<div className="page-layout-with-back-arrow">
			<DirectBackArrowHeader
				destination="/campus-condition"
				title="Most Useful Condition"
			/>
			{loading ? (
				<Loader />
			) : (
				<div className="mt-5 md:w-4/5 md:mx-auto shadowDesign rounded-xl">
					<CampusCondition
						condition={mostUsefulCondition}
						inViewMostUseful={true}
					/>
				</div>
			)}
		</div>
	);
};

export default ViewMostUsefulCondition;
