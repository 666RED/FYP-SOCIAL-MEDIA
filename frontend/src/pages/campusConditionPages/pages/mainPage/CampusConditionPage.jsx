import { React, useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Header from "../../../../components/Header.jsx";
import SideBar from "../../../../components/Sidebar/SideBar.jsx";
import Error from "../../../../components/Error.jsx";
import MostUseful from "./components/MostUseful.jsx";
import CampusConditions from "./components/CampusConditions.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import {
	appendCampusConditions,
	setHasConditions,
	resetState,
} from "../../features/campusConditionSlice.js";
import { ServerContext } from "../../../../App.js";

const CampusConditionPage = () => {
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [loadMore, setLoadMore] = useState(false);
	const { hasConditions, isLoadingConditions, campusConditions } = useSelector(
		(store) => store.campusCondition
	);
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
				`${serverURL}/campus-condition/get-campus-conditions?currentTime=${updatedTime}&conditionIds=${JSON.stringify(
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
		<div className="py-2">
			{/* SIDEBAR */}
			<SideBar
				selectedSection="Campus Condition"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
			{/* HEADER */}
			<Header
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				title={"Campus Condition"}
			/>

			{/* MAIN CONTENT */}
			<div className="page-design lg:grid lg:grid-cols-5 gap-x-3">
				{/* BUTTON ROW */}
				<div className="lg:col-span-5 grid grid-cols-12 gap-x-2 my-3">
					{/* UPLOAD NEW BUTTTON */}
					<button
						className="btn-green text-base select-none col-span-5 md:col-span-3 lg:col-span-2"
						onClick={() => navigate("/campus-condition/upload-condition")}
					>
						Upload New
					</button>
					{/* YOUR CONDITIONS BUTTON */}
					<button
						className="btn-gray text-base select-none col-span-6 md:col-span-3 lg:col-span-2"
						onClick={() => navigate("/campus-condition/your-conditions")}
					>
						Your Conditions
					</button>
				</div>
				{/* MOST USEFUL SECITON */}
				<div className="lg:col-span-2 ">
					<MostUseful />
				</div>
				<hr className="border-gray-400 my-3 border-2 lg:hidden" />
				{/* CAMPUS CONDITIONS */}
				<div className="lg:col-span-3 col-start-2 ">
					<CampusConditions currentTime={updatedTime} />
				</div>
				{/* LOAD MORE BUTTON*/}
				<div className="col-span-5">
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

export default CampusConditionPage;
