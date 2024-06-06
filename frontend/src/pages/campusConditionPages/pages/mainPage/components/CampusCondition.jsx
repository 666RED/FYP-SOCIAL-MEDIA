import { React, useEffect, useContext, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { BsThreeDots } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiThumbUp, HiThumbDown } from "react-icons/hi";
import { MdEdit, MdDeleteForever, MdReportProblem } from "react-icons/md";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";

import UserPostHeader from "../../../../profilePages/components/UserPostHeader.jsx";
import ViewLocation from "./ViewLocation.jsx";
import EditConditionForm from "./EditConditionForm.jsx";
import OptionDiv from "../../../../../components/OptionDiv.jsx";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import ReportForm from "../../../../../components/post/ReportForm.jsx";
import FocusImage from "../../../../adminPages/components/FocusImage.jsx";
import {
	CampusConditionReducer,
	INITIAL_STATE,
} from "../features/campusConditionReducer.js";
import ACTION_TYPES from "../actionTypes/campusConditionActionTypes.js";
import {
	loadMap,
	removeCampusCondition,
	removeMostUsefulCondition,
	setHasConditions,
} from "../../../features/campusConditionSlice.js";
import { ServerContext } from "../../../../../App.js";

const CampusCondition = ({ condition, inViewMostUseful = false }) => {
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(CampusConditionReducer, INITIAL_STATE);
	const { campusConditions } = useSelector((store) => store.campusCondition);
	const [showImage, setShowImage] = useState(false);

	const previous = window.location.pathname;

	// first render
	useEffect(() => {
		dispatch({
			type: ACTION_TYPES.FIRST_RENDER,
			payload: { condition, userId: user._id },
		});
	}, []);

	const handleUp = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: true });
			if (!state.isUp) {
				const res = await fetch(`${serverURL}/campus-condition/handle-up`, {
					method: "PATCH",
					body: JSON.stringify({
						conditionId: condition._id,
						userId: user._id,
						isDown: state.isDown,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					if (state.isDown) {
						dispatch({ type: ACTION_TYPES.UP_POST_AND_CANCEL_DOWN });
					} else {
						dispatch({ type: ACTION_TYPES.UP_POST });
					}
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Condition not found", { variant: "error" });
				} else if (msg === "Condition not updated") {
					enqueueSnackbar("Fail to update condition", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}
			} else {
				const res = await fetch(`${serverURL}/campus-condition/cancel-up`, {
					method: "PATCH",
					body: JSON.stringify({
						conditionId: condition._id,
						userId: user._id,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					dispatch({ type: ACTION_TYPES.CANCEL_UP });
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Fail to update condition", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}
			}

			dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
		}
	};

	const handleDown = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: true });
			if (!state.isDown) {
				const res = await fetch(`${serverURL}/campus-condition/handle-down`, {
					method: "PATCH",
					body: JSON.stringify({
						conditionId: condition._id,
						userId: user._id,
						isUp: state.isUp,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					if (state.isUp) {
						dispatch({ type: ACTION_TYPES.DOWN_POST_AND_CANCEL_UP });
					} else {
						dispatch({ type: ACTION_TYPES.DOWN_POST });
					}
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Fail to update condition", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
			} else {
				const res = await fetch(`${serverURL}/campus-condition/cancel-down`, {
					method: "PATCH",
					body: JSON.stringify({
						conditionId: condition._id,
						userId: user._id,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					dispatch({ type: ACTION_TYPES.CANCEL_DOWN });
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Fail to update condition", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}
			}
			dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
		}
	};

	const handleViewLocation = () => {
		sliceDispatch(
			loadMap({
				lat: parseFloat(condition.conditionLocation.locationLatitude),
				lng: parseFloat(condition.conditionLocation.locationLongitude),
			})
		);
		dispatch({ type: ACTION_TYPES.TOGGLE_VIEW_LOCATION });
	};

	const handleDeleteCondition = async () => {
		try {
			const ans = window.confirm("Delete condition?");
			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(
					`${serverURL}/campus-condition/delete-condition`,
					{
						method: "PATCH",
						body: JSON.stringify({
							conditionId: condition._id,
						}),
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					dispatch({
						type: ACTION_TYPES.SET_LOADING,
						payload: false,
					});
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, deletedCondition } = await res.json();

				if (msg === "Success") {
					if (campusConditions.length === 10) {
						sliceDispatch(setHasConditions(true));
					}
					sliceDispatch(removeCampusCondition(deletedCondition));
					sliceDispatch(removeMostUsefulCondition(deletedCondition));
					enqueueSnackbar("Condition deleted", { variant: "success" });
					if (inViewMostUseful) {
						navigate("/campus-condition");
						return;
					}
				} else if (msg === "Fail to delete condition") {
					enqueueSnackbar("Fail to delete condition", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occured", {
						variant: "error",
					});
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
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

	const handleMarkSolved = async () => {
		try {
			const confirmText = state.conditionResolved
				? "Remove resolved?"
				: "Mark resolved?";
			const ans = window.confirm(confirmText);
			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(
					`${serverURL}/campus-condition/update-condition-resolved`,
					{
						method: "PATCH",
						body: JSON.stringify({
							campusConditionId: condition._id,
							isConditionResolved: state.conditionResolved,
							userId: user._id,
						}),
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					dispatch({ type: ACTION_TYPES.TOGGLE_CONDITION_RESOLVED });
					if (!state.conditionResolved) {
						enqueueSnackbar("Condition is marked resolved", {
							variant: "success",
						});
					} else {
						enqueueSnackbar("Removed resolved", {
							variant: "success",
						});
					}
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Condition not found", {
						variant: "error",
					});
				} else if (msg === "Fail to update condition") {
					enqueueSnackbar("Fail to update condition", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });

				dispatch({ type: ACTION_TYPES.FINISH_MARKING });
			}
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

	return (
		<div className="relative mb-3 bg-white rounded-xl shadow-2xl py-4 px-2 w-full mx-auto">
			{state.loading && <Spinner />}
			{/* REPORT FORM */}
			{state.showReportForm && (
				<ReportForm
					id={condition._id}
					toggleShowReportForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM })
					}
					toggleShowOptionDiv={() =>
						dispatch({
							type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV,
						})
					}
					type="Condition"
				/>
			)}
			{/* VIEW LOCATION DIV*/}
			{state.viewLocation && (
				<ViewLocation
					toggleViewLocation={() =>
						dispatch({
							type: ACTION_TYPES.TOGGLE_VIEW_LOCATION,
						})
					}
				/>
			)}

			{/* EDIT CONDITION FORM */}
			{state.showEditConditionForm && (
				<EditConditionForm
					toggleShowEditConditionForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_EDIT_CONDITION_FORM })
					}
					toggleShowOptionDiv={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })
					}
					condition={condition}
					inViewMostUseful={inViewMostUseful}
				/>
			)}

			{/* OPTION DIV */}
			{state.showOptionDiv && (
				<div className="absolute right-3 top-10 border border-gray-600 bg-gray-200">
					{user._id === condition.userId ? (
						<div>
							{/* EDIT */}
							<OptionDiv
								func={() =>
									dispatch({
										type: ACTION_TYPES.TOGGLE_SHOW_EDIT_CONDITION_FORM,
									})
								}
								icon={<MdEdit />}
								text="Edit"
							/>
							{/* DELETE */}
							<OptionDiv
								func={handleDeleteCondition}
								icon={<MdDeleteForever />}
								text="Delete"
							/>
							{/* MARK RESOLVED */}
							<OptionDiv
								isMarking={state.isMarking}
								func={handleMarkSolved}
								icon={
									state.conditionResolved ? (
										<IoIosCloseCircle />
									) : (
										<IoIosCheckmarkCircle />
									)
								}
								text={`${
									state.conditionResolved ? "Remove resolved" : "Mark resolved"
								}`}
							/>
						</div>
					) : (
						// REPORT
						<OptionDiv
							func={() =>
								dispatch({
									type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM,
								})
							}
							icon={<MdReportProblem />}
							text="Report"
						/>
					)}
				</div>
			)}

			{/* FOCUS IMAGE */}
			{showImage && (
				<FocusImage
					imagePath={condition.conditionImagePath}
					setShowImage={setShowImage}
				/>
			)}

			{/* HEADER */}
			<UserPostHeader
				imgPath={condition.profileImagePath}
				userName={condition.userName}
				postTime={condition.time}
				conditionResolved={state.conditionResolved}
				destination={`/profile/${condition.userId}`}
				previous={previous}
				frameColor={condition.frameColor}
			/>
			<BsThreeDots
				className="absolute cursor-pointer top-6 right-3"
				onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })}
			/>
			{/* CONDITION TITLE */}
			<h3 className="mt-2 font-semibold">{condition.conditionTitle}</h3>

			{/* CONDITION DESCRIPTION */}
			<p className="mt-1 mb-4">{condition.conditionDescription}</p>

			{/* CONDITION IMAGE */}
			{condition.conditionImagePath !== "" && (
				<img
					src={condition.conditionImagePath}
					alt="Condition image"
					className="rounded-xl mx-auto max-img-height cursor-pointer"
					onClick={() => setShowImage(true)}
				/>
			)}

			{/* VIEW LOCATION TEXT*/}
			<div
				className="inline-flex mt-3 cursor-pointer text-blue-600 hover:opacity-80"
				onClick={() => handleViewLocation()}
			>
				<FaMapMarkerAlt className="text-lg mr-1" />
				<p>View location</p>
			</div>

			{/* UP AND DOWN DIV */}
			<div className="grid grid-cols-11 mt-5">
				{/* UP */}
				<div
					className="col-span-5 border border-black rounded-xl cursor-pointer grid grid-cols-3 py-2 hover:bg-gray-200"
					onClick={() => !state.isProcessing && handleUp()}
				>
					<div
						className={`justify-self-center text-xl ${
							state.isUp && "text-blue-600"
						}`}
					>
						<HiThumbUp />
					</div>
					<h6 className="justify-self-center text-sm sm:text-base select-none">
						Up
					</h6>
					<p className="justify-self-center">{state.conditionUp}</p>
				</div>

				{/* DOWN */}
				<div
					className="col-span-5 col-start-7 border border-black rounded-xl cursor-pointer grid grid-cols-3 py-2 hover:bg-gray-200"
					onClick={() => !state.isProcessing && handleDown()}
				>
					<div
						className={`justify-self-center text-xl ${
							state.isDown && "text-blue-600"
						}`}
					>
						<HiThumbDown />
					</div>
					<h6 className="justify-self-center text-sm sm:text-base select-none">
						Down
					</h6>
					<p className="justify-self-center">{state.conditionDown}</p>
				</div>
			</div>
		</div>
	);
};

export default CampusCondition;
