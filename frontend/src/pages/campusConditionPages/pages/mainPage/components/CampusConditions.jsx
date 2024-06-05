import { React, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import CampusCondition from "../components/CampusCondition.jsx";
import { ServerContext } from "../../../../../App.js";
import {
	setCampusConditions,
	setHasConditions,
	setIsLoadingConditions,
} from "../../../features/campusConditionSlice.js";

const CampusConditions = ({ currentTime, yourCondition = false }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { campusConditions, isLoadingConditions } = useSelector(
		(store) => store.campusCondition
	);
	const { enqueueSnackbar } = useSnackbar();
	const getPath = yourCondition
		? `${serverURL}/campus-condition/get-your-campus-conditions?currentTime=${currentTime}&userId=${
				user._id
		  }&conditions=${JSON.stringify([])}`
		: `${serverURL}/campus-condition/get-campus-conditions?currentTime=${currentTime}&conditionIds=${JSON.stringify(
				[]
		  )}`;

	// get conditions
	useEffect(() => {
		const getConditions = async () => {
			sliceDispatch(setIsLoadingConditions(true));
			try {
				const res = await fetch(getPath, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					sliceDispatch(setIsLoadingConditions(false));
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
					if (returnConditions.length < 10) {
						sliceDispatch(setHasConditions(false));
					} else {
						sliceDispatch(setHasConditions(true));
					}
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}

				sliceDispatch(setIsLoadingConditions(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				sliceDispatch(setIsLoadingConditions(false));
			}
		};
		getConditions();
	}, []);

	return (
		<div>
			{isLoadingConditions ? (
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
