import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import MostUsefulCondition from "./MostUsefulCondition.jsx";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import { setMostUsefulConditions } from "../../../features/campusConditionSlice.js";
import { ServerContext } from "../../../../../App.js";

const MostUsefulConditions = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.auth);
	const { mostUsefulConditions } = useSelector(
		(store) => store.campusCondition
	);
	const [loading, setLoading] = useState(false);

	// Get all most useful posts and save in redux store
	useEffect(() => {
		const getMostUsefulConditions = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`${serverURL}/campus-condition/get-most-useful-conditions`,
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

				const { msg, mostUsefulConditions } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setMostUsefulConditions(mostUsefulConditions));
				} else if (msg === "Conditions not found") {
					enqueueSnackbar("Fail to load conditions", { variant: "error" });
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

		getMostUsefulConditions();
	}, []);

	return (
		<div className="mt-4">
			{loading ? (
				<Loader />
			) : mostUsefulConditions.length > 0 ? (
				mostUsefulConditions.map((condition) => (
					<MostUsefulCondition condition={condition} key={condition._id} />
				))
			) : (
				<h2 className="text-center">No condition</h2>
			)}
		</div>
	);
};

export default MostUsefulConditions;
