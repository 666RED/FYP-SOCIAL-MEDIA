import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import CampusConditions from "../mainPage/components/CampusConditions.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import {
	appendCampusConditions,
	setHasConditions,
	resetState,
} from "../../features/campusConditionSlice.js";
import { ServerContext } from "../../../../App.js";

const YourConditionsPage = () => {
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { hasConditions, isLoadingConditions, campusConditions } = useSelector(
		(store) => store.campusCondition
	);
	const [loadMore, setLoadMore] = useState(false);

	const currentTime = new Date();
	currentTime.setSeconds(currentTime.getSeconds() + 1);
	const updatedTime = currentTime.toUTCString();

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/campus-condition/get-your-campus-conditions?currentTime=${updatedTime}&userId=${
					user._id
				}&conditionIds=${JSON.stringify(
					campusConditions.map((condition) => condition._id)
				)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnConditions } = await res.json();

			if (msg === "Campus conditions not found") {
				enqueueSnackbar("Campus conditions not found", {
					variant: "error",
				});
			} else if (msg === "Success") {
				sliceDispatch(appendCampusConditions(returnConditions));
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

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	return user && token ? (
		<div>
			{/* HEADER */}
			<div className="mx-3 my-3 bg-white">
				<DirectBackArrowHeader
					destination={"/campus-condition"}
					title="Your Conditions"
				/>
			</div>
			<div className="page-design pb-3">
				<div className="component-layout">
					{/* CAMPUS CONDITIONS */}
					<CampusConditions currentTime={updatedTime} yourCondition={true} />
					{/* LOAD MORE BUTTON */}
					<LoadMoreButton
						handleLoadMore={handleLoadMore}
						hasComponent={hasConditions}
						isLoadingComponent={isLoadingConditions}
						loadMore={loadMore}
					/>
				</div>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default YourConditionsPage;
