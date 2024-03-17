import { React, useEffect, useContext, useReducer } from "react";
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
import {
	CampusConditionReducer,
	INITIAL_STATE,
} from "../features/campusConditionReducer.js";
import ACTION_TYPES from "../actionTypes/campusConditionActionTypes.js";
import {
	loadMap,
	removeCampusCondition,
	removeMostUsefulCondition,
	updateCampusCondition,
	updateMostUsefulCondition,
} from "../../../features/campusConditionSlice.js";
import { ServerContext } from "../../../../../App.js";

const CampusCondition = ({ condition, inViewMostUseful = false }) => {
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(CampusConditionReducer, INITIAL_STATE);

	const profileImgPath = `${serverURL}/public/images/profile/`;
	const conditionImagePath = `${serverURL}/public/images/campus-condition/`;

	const previous = window.location.pathname;

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await fetch(`${serverURL}/campus-condition/get-user-info`, {
					method: "POST",
					body: JSON.stringify({
						userId: condition.userId,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({
						type: ACTION_TYPES.SET_LOADING,
						payload: false,
					});
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, profileImagePath, userName } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.FIRST_RENDER,
						payload: {
							userId: user._id,
							userName,
							profileImagePath,
							duration: Math.floor(condition.duration),
							condition,
						},
					});
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", { variant: "error" });
				} else {
					enqueueSnackbar("Fail to load user info", { variant: "error" });
				}
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};
		getUserInfo();
	}, [condition]);

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
				lat: parseFloat(state.locationLatitude),
				lng: parseFloat(state.locationLongitude),
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
						method: "DELETE",
						body: JSON.stringify({
							condition,
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

				const { msg, returnCondition } = await res.json();

				if (msg === "Success") {
					sliceDispatch(updateCampusCondition(returnCondition));
					sliceDispatch(updateMostUsefulCondition(returnCondition));
					if (returnCondition.conditionResolved) {
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
						variant: "success",
					});
				} else if (msg === "Fail to update condition") {
					enqueueSnackbar("Fail to update condition", {
						variant: "success",
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
					{user._id === state.conditionPosterId ? (
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
									type: ACTION_TYPES.TOGGLE_SHOW_REPORT_CONDITION_FORM,
								})
							}
							icon={<MdReportProblem />}
							text="Report"
						/>
					)}
				</div>
			)}

			{/* HEADER */}
			<UserPostHeader
				imgPath={profileImgPath + state.profileImagePath}
				userName={state.userName}
				postTime={state.updateTimeDuration}
				conditionResolved={state.conditionResolved}
				destination={`/profile/${condition.userId}`}
				previous={previous}
			/>
			<BsThreeDots
				className="absolute cursor-pointer top-6 right-3"
				onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_OPTION_DIV })}
			/>
			{/* CONDITION TITLE */}
			<h3 className="mt-2 font-semibold">{state.conditionTitle}</h3>

			{/* CONDITION DESCRIPTION */}
			<p className="mt-1 mb-4">{state.conditionDescription}</p>

			{/* CONDITION IMAGE */}
			{state.conditionImagePath !== "" && (
				<img
					src={conditionImagePath + state.conditionImagePath}
					className="rounded-xl mx-auto w-full"
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
					<h6 className="justify-self-center text-sm sm:text-base">Up</h6>
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
					<h6 className="justify-self-center text-sm sm:text-base">Down</h6>
					<p className="justify-self-center">{state.conditionDown}</p>
				</div>
			</div>
		</div>
	);
};

export default CampusCondition;
