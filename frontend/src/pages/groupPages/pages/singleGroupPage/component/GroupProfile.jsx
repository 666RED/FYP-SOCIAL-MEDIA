import { React, useContext, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import JoinGroupStatusButton from "./JoinGroupStatusButton.jsx";
import FocusImage from "../../../../adminPages/components/FocusImage.jsx";
import ReportForm from "../../../../../components/post/ReportForm.jsx";
import {
	groupProfileReducer,
	INITIAL_STATE,
} from "../feature/groupProfileReducer.js";
import ACTION_TYPES from "../actionTypes/groupProfileActionTypes.js";
import { resetState } from "../../../../../features/groupSlice.js";
import { ServerContext } from "../../../../../App.js";

const GroupProfile = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { groupId } = useParams();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(groupProfileReducer, INITIAL_STATE);
	const navigate = useNavigate();
	const [showGroupImage, setShowGroupImage] = useState(false);
	const [showCoverImage, setShowCoverImage] = useState(false);

	// retrieve group profile info
	useEffect(() => {
		const fetchGroupInfo = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(
					`${serverURL}/group/get-group?groupId=${groupId}`,
					{
						method: "GET",
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

				const { msg, returnGroup } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.FIRST_RENDER,
						payload: { returnGroup },
					});
				} else if (msg === "Group not found") {
					enqueueSnackbar("Group not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		};

		fetchGroupInfo();
	}, []);

	// get group request status (for member)
	useEffect(() => {
		const fetchGroupRequestStatus = async () => {
			try {
				dispatch({
					type: ACTION_TYPES.SET_LOAD_JOIN_GROUP_STATUS,
					payload: true,
				});

				const res = await fetch(
					`${serverURL}/join-group-request/get-join-group-request?requestorId=${user._id}&groupId=${groupId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					dispatch({
						type: ACTION_TYPES.SET_LOAD_JOIN_GROUP_STATUS,
						payload: false,
					});

					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, joinGroupRequest } = await res.json();

				if (msg === "No request") {
					dispatch({
						type: ACTION_TYPES.SET_JOIN_GROUP_REQUEST_AND_STATUS,
						payload: {
							joinGroupRequest: {},
							joinGroupStatus: "Not join",
						},
					});
				} else if (msg === "Sent join group request") {
					dispatch({
						type: ACTION_TYPES.SET_JOIN_GROUP_REQUEST_AND_STATUS,
						payload: {
							joinGroupRequest,
							joinGroupStatus: "Pending",
						},
					});
				} else if (msg === "Already joined") {
					dispatch({
						type: ACTION_TYPES.SET_JOIN_GROUP_REQUEST_AND_STATUS,
						payload: {
							joinGroupRequest,
							joinGroupStatus: "Accepted",
						},
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({
					type: ACTION_TYPES.SET_LOAD_JOIN_GROUP_STATUS,
					payload: false,
				});
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch({
					type: ACTION_TYPES.SET_LOAD_JOIN_GROUP_STATUS,
					payload: false,
				});
			}
		};

		fetchGroupRequestStatus();
	}, []);

	// get number of join group requests (for group admin)
	useEffect(() => {
		const fetchNumberJoinGroupRequests = async () => {
			try {
				const res = await fetch(
					`${serverURL}/join-group-request/get-number-join-group-requests?groupId=${groupId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, numberJoinGroupRequest } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.SET_NUMBER_JOIN_GROUP_REQUESTS,
						payload: numberJoinGroupRequest,
					});
				}
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};

		fetchNumberJoinGroupRequests();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	// ALL FOR MEMBER
	const handleJoinGroup = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const res = await fetch(
				`${serverURL}/join-group-request/send-join-group-request`,
				{
					method: "POST",
					body: JSON.stringify({ requestorId: user._id, groupId: groupId }),
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

			const { msg, savedJoinGroupRequest } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Join group request sent", { variant: "success" });
				dispatch({
					type: ACTION_TYPES.SET_JOIN_GROUP_REQUEST_AND_STATUS,
					payload: {
						joinGroupRequest: savedJoinGroupRequest,
						joinGroupStatus: "Pending",
					},
				});
			} else if (msg === "Join group request not created") {
				enqueueSnackbar("Fail to sent join group request", {
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

	const handleLeaveGroup = async () => {
		try {
			const ans = window.confirm("Leave group?");
			if (ans) {
				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: true,
				});

				const res = await fetch(`${serverURL}/group/leave-group`, {
					method: "PATCH",
					body: JSON.stringify({ userId: user._id, groupId: groupId }),
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

				const { msg } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Left group", { variant: "success" });
					navigate("/group");
				} else if (msg === "Fail to remove member") {
					enqueueSnackbar("Fail to leave group", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
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

	const handleCancelRequest = async () => {
		try {
			const ans = window.confirm("Cancel join group request?");

			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(
					`${serverURL}/join-group-request/cancel-join-group-request`,
					{
						method: "DELETE",
						body: JSON.stringify({ requestorId: user._id, groupId: groupId }),
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
					dispatch({
						type: ACTION_TYPES.SET_JOIN_GROUP_REQUEST_AND_STATUS,
						payload: { joinGroupRequest: {}, joinGroupStatus: "Not join" },
					});
					enqueueSnackbar("Join group request cancelled", {
						variant: "success",
					});
				} else if (msg === "Fail to cancel join group request") {
					enqueueSnackbar("Fail to cancel join group request", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	return (
		<div>
			{state.loading && <Spinner />}
			{/* REPORT FORM */}
			{state.showReportForm && (
				<ReportForm
					id={groupId}
					toggleShowReportForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM })
					}
					type="Group"
				/>
			)}
			{/* FOCUS IMAGE (GROUP IMAGE) */}
			{showGroupImage && (
				<FocusImage
					imagePath={state.groupImagePath}
					setShowImage={setShowGroupImage}
					isProfileImage={true}
				/>
			)}
			{/* FOCUS IMAGE (COVER IMAGE) */}
			{showCoverImage && (
				<FocusImage
					imagePath={state.groupCoverImagePath}
					setShowImage={setShowCoverImage}
				/>
			)}
			{/* GROUP COVER IMAGE */}
			<img
				src={state.groupCoverImagePath}
				alt="Group cover image"
				className="rounded-xl mt-3 component-layout cursor-pointer"
				onClick={() => setShowCoverImage(true)}
			/>
			{/* LOWER PART */}
			<div className="component-layout my-3 shadow-xl rounded-xl py-3 bg-white grid grid-cols-12 items-center">
				{/* LEFT PART */}
				<div className="flex flex-col items-center justify-center col-span-5">
					{/* GROUP IMAGE */}
					<img
						src={state.groupImagePath}
						alt="Group image"
						className="rounded-full md:w-36 w-28 border border-blue-400 cursor-pointer"
						onClick={() => setShowGroupImage(true)}
					/>
					{/* GROUP NAME */}
					<p className="my-3 md:text-xl text-lg font-semibold leading-none">
						{state.groupName}
					</p>
					{/* NUMBER OF MEMBERS */}
					<p className="text-sm leading-none">
						{state.numOfMembers} {state.numOfMembers > 1 ? "members" : "member"}
					</p>
				</div>
				{/* RIGHT PART */}
				<div className="flex flex-col col-span-5 col-start-7">
					{/* FOR GROUP ADMIN */}
					{/* EDIT GROUP BUTTON */}
					{state.groupAdminId === user._id && (
						<button
							className="btn-green my-2 text-sm sm:text-base"
							onClick={() => navigate(`/group/edit-group/${groupId}`)}
						>
							Edit Group
						</button>
					)}
					{/* JOIN REQUEST BUTTON */}
					{state.groupAdminId === user._id && (
						<button
							className="btn-yellow my-2 text-sm sm:text-base relative"
							onClick={() => navigate(`/group/join-request/${groupId}`)}
						>
							Join Request
							{/* RED CIRCLE */}
							{state.numberJoinGroupRequests !== 0 && (
								<p className="absolute rounded-full bg-red-500 w-6 -top-1 -right-1 text-[12px] sm:text-base">
									{state.numberJoinGroupRequests}
								</p>
							)}
						</button>
					)}
					{/* FOR MEMBER */}
					{/* JOIN GROUP STATUS BUTTON */}
					{state.groupAdminId !== user._id &&
						(state.loadJoinGroupStatus ? (
							<Loader />
						) : (
							<JoinGroupStatusButton
								functions={{
									handleJoinGroup,
									handleLeaveGroup,
									handleCancelRequest,
								}}
								joinGroupStatus={state.joinGroupStatus}
							/>
						))}
					{/* FOR BOTH GROUP ADMIN AND MEMBER */}
					{/* VIEW MEMBERS BUTTON */}
					<button
						className="btn-gray my-2 text-sm sm:text-base"
						onClick={() =>
							navigate(`/group/view-members/${groupId}/${state.groupAdminId}`)
						}
					>
						View Members
					</button>
					{/* FOR MEMBER */}
					{/* REPORT GROUP BUTTON */}
					{state.groupAdminId !== user._id && (
						<button
							className="btn-orange my-2 text-sm sm:text-base"
							onClick={() =>
								dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM })
							}
						>
							Report Group
						</button>
					)}
				</div>
			</div>
			<hr />
			{/* GROUP BIO */}
			{state.groupBio !== "" && (
				<p className="shadow-2xl bg-white p-2 rounded-xl text-black component-layout mx-auto">
					{state.groupBio}
				</p>
			)}
		</div>
	);
};

export default GroupProfile;
