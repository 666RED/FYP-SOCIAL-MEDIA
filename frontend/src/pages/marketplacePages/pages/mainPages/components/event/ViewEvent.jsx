import { React, useEffect, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FaPhoneAlt } from "react-icons/fa";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../../../components/Error.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import EventInfo from "./EventInfo.jsx";
import SellerInfo from "../../../../../../components/SellerInfo.jsx";
import { viewEventReducer, INITIAL_STATE } from "./feature/viewEventReducer.js";
import ACTION_TYPES from "./actionTypes/viewEventActionTypes.js";
import { ServerContext } from "../../../../../../App.js";

const ViewEvent = () => {
	const { id } = useParams();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(viewEventReducer, INITIAL_STATE);
	const navigate = useNavigate();

	// first render
	useEffect(() => {
		const getEvent = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/event/get-event?id=${id}`, {
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

				const { msg, event } = await res.json();

				if (msg === "Success") {
					dispatch({ type: ACTION_TYPES.FIRST_RENDER, payload: event });
				} else if (msg === "Event not found") {
					enqueueSnackbar("Event not found", {
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
				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
			}
		};

		getEvent();
	}, []);

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/marketplace/event/view-event/${id}`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${state.userId}`);
	};

	return user && token ? (
		<div className="page-layout-with-back-arrow mb-5">
			{/* HEADER */}
			<DirectBackArrowHeader destination="/marketplace" title="View Event" />
			{state.loading && <Spinner />}
			{/* FORM CONTAINER */}
			<form
				action=""
				className="mx-auto w-4/5 border border-gray-500 rounded-xl mt-5 p-3 md:max-w-[50rem]"
			>
				{/* EVENT INFORMATION */}
				<EventInfo event={state} />
				{/* HORIZONTAL LINE */}
				<hr className="my-2 border border-gray-400" />
				{/* SELLER INFORMATION */}
				<SellerInfo
					handleOnClick={handleOnClick}
					name="Event Promoter"
					state={{ ...state, contactNumber: state.contactNumbers[0] }}
				/>
				{/* OTHER CONTACT NUMBERS */}
				{state.contactNumbers.length > 1 && (
					<div>
						{/* HORIZONTAL LINE */}
						<hr className="my-2 border border-gray-400" />
						<h3 className="mt-3 mb-2">Other contact numbers</h3>
						<div className="flex items-center">
							<FaPhoneAlt className="mr-2" />
							{state.contactNumbers
								.filter((_, index) => index !== 0)
								.join(", ")}
						</div>
					</div>
				)}
			</form>
		</div>
	) : (
		<Error />
	);
};

export default ViewEvent;
