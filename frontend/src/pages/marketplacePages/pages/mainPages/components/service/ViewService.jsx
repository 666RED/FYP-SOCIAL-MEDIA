import { React, useEffect, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdReport } from "react-icons/md";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../../../components/Error.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import ServiceInfo from "./ServiceInfo.jsx";
import SellerInfo from "../../../../../../components/SellerInfo.jsx";
import ReportForm from "../../../../../../components/post/ReportForm.jsx";
import {
	viewServiceReducer,
	INITIAL_STATE,
} from "./feature/viewServiceReducer.js";
import ACTION_TYPES from "./actionTypes/viewServiceActionTypes.js";
import { ServerContext } from "../../../../../../App.js";

const ViewService = () => {
	const { id } = useParams();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(viewServiceReducer, INITIAL_STATE);
	const navigate = useNavigate();

	// first render
	useEffect(() => {
		const getService = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/service/get-service?id=${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });

					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, service } = await res.json();

				if (msg === "Success") {
					dispatch({ type: ACTION_TYPES.FIRST_RENDER, payload: service });
				} else if (msg === "Service not found") {
					enqueueSnackbar("Service not found", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		};

		getService();
	}, []);

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/marketplace/service/view-service/${id}`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${state.userId}`);
	};

	const handleReport = async () => {
		dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM });
	};

	return user && token ? (
		<div className="page-layout-with-back-arrow mb-5">
			{/* REPORT FORM */}
			{state.showReportForm && (
				<ReportForm
					type="Service"
					id={id}
					toggleShowReportForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM })
					}
				/>
			)}
			{/* HEADER */}
			<DirectBackArrowHeader destination="/marketplace" title="View Service" />
			{state.loading && <Spinner />}
			{/* FORM CONTAINER */}
			<form className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3">
				{/* SERVICE INFORMATION */}
				<ServiceInfo service={state} />
				{/* HORIZONTAL LINE */}
				<hr className="my-2 border border-gray-400" />
				{/* SELLER INFORMATION */}
				<SellerInfo
					name="Service Provider"
					state={state}
					handleOnClick={handleOnClick}
				/>
			</form>
			{/* REPORT ICON */}
			<MdReport
				className="text-3xl cursor-pointer hover:opacity-80 text-red-600 absolute top-1 right-1"
				onClick={handleReport}
			/>
		</div>
	) : (
		<Error />
	);
};

export default ViewService;
