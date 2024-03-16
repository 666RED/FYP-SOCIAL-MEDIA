import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import CampusCondition from "../components/CampusCondition.jsx";
import { ServerContext } from "../../../../../App.js";
import { setCampusConditions } from "../../../features/campusConditionSlice.js";

const CampusConditions = ({ currentTime, loading, setLoading }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { campusConditions } = useSelector((store) => store.campusCondition);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const getConditions = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`${serverURL}/campus-condition/get-campus-conditions?currentTime=${currentTime}`,
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

				const { msg, returnConditions } = await res.json();

				if (msg === "Campus conditions not found") {
					enqueueSnackbar("Campus conditions not found", {
						variant: "error",
					});
				} else if (msg === "Success") {
					sliceDispatch(setCampusConditions(returnConditions));
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};
		getConditions();
	}, []);

	return (
		<div>
			{loading ? (
				<Loader />
			) : (
				<div className="component-layout rounded-xl w-full">
					{campusConditions.length > 0 ? (
						campusConditions.map((condition) => (
							<CampusCondition key={condition._id} condition={condition} />
						))
					) : (
						<h2 className="text-center my-2">No condition</h2>
					)}
				</div>
			)}
		</div>
	);
};

export default CampusConditions;
