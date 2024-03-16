import { React, useContext, useReducer, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { FaMale, FaFemale } from "react-icons/fa";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import { pendingReducer, INITIAL_STATE } from "../feature/pendingReducer.js";
import ACTION_TYPES from "../actionTypes/pendingActionTypes.js";
import { ServerContext } from "../../../../../App.js";

const Pending = ({ pending }) => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const profileImagePath = pending.receiverId.userProfile.profileImagePath;
	const filePath = `${serverURL}/public/images/profile/${profileImagePath}`;
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [state, dispatch] = useReducer(pendingReducer, INITIAL_STATE);

	// set pending friend request to local state
	useEffect(() => {
		dispatch({ type: ACTION_TYPES.SET_FRIEND_REQUEST, payload: pending });
	}, []);

	const handleAddFriend = async () => {
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		try {
			const res = await fetch(
				`${serverURL}/friend-request/send-friend-request`,
				{
					method: "POST",
					body: JSON.stringify({
						requestorId: user._id,
						receiverId: pending.receiverId._id,
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

			const response = await res.json();

			if (response.msg === "Success") {
				enqueueSnackbar("Friend request sent", { variant: "success" });
				dispatch({
					type: ACTION_TYPES.SET_FRIEND_STATUS,
					payload: "Pending",
				});
				dispatch({
					type: ACTION_TYPES.SET_FRIEND_REQUEST,
					payload: response.savedFriendRequest,
				});
				dispatch({ type: ACTION_TYPES.SET_IS_PENDING, payload: true });
			} else if (response.msg === "Friend request not created") {
				enqueueSnackbar("Fail to send friend request", { variant: "error" });
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

	const handleCancelRequest = async () => {
		try {
			const ans = window.confirm("Cancel friend request?");
			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(
					`${serverURL}/friend-request/cancel-friend-request`,
					{
						method: "DELETE",
						body: JSON.stringify({
							friendRequestId: state.friendRequest._id,
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

				const response = await res.json();
				if (response.msg === "Success") {
					dispatch({
						type: ACTION_TYPES.SET_FRIEND_STATUS,
						payload: "Not friend",
					});
					dispatch({ type: ACTION_TYPES.SET_IS_PENDING, payload: false });

					enqueueSnackbar("Friend request cancelled", {
						variant: "success",
					});
				} else if (response.msg === "Friend request not found") {
					enqueueSnackbar("Fail to cancel friend reqeust", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
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

	const handleNavigate = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/friend/friend-request-pending`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${pending.receiverId._id}`);
	};

	return (
		<div className="rounded-xl p-3 my-2 border border-gray-300 shadow-xl col-span-12 md:col-span-4 lg:col-span-3 grid grid-cols-12 grid-rows-2 md:flex md:flex-col items-center md:items-start gap-x-12">
			{state.loading && <Spinner />}
			{/* IMAGE */}
			<img
				src={filePath}
				alt="User profile image"
				className="col-span-2 row-span-3 border border-blue-400 rounded-full max-w-20 md:max-w-32 md:self-center"
			/>
			{/* USER NAME */}
			<div className="col-span-8 md:my-3 md:text-xl md:flex-1 flex">
				<p className="cursor-pointer hover:opacity-80" onClick={handleNavigate}>
					{pending.receiverId.userName}
					{/* GENDER */}
					{pending.receiverId.userGender === "male" ? (
						<FaMale className="text-blue-500 inline" />
					) : (
						<FaFemale className="text-pink-500 inline" />
					)}
				</p>
			</div>

			{/* BUTTONS ROW */}
			<div className="col-span-8 md:flex md:w-full">
				{state.isPending ? (
					// PENDING BUTTON
					<button
						className="btn-yellow mr-3 min-w-24 md:flex-1"
						onClick={handleCancelRequest}
					>
						Pending
					</button>
				) : (
					// ADD FRIEND BUTTON
					<button
						className="btn-blue min-w-24 md:flex-1"
						onClick={handleAddFriend}
					>
						Add Friend
					</button>
				)}
			</div>
		</div>
	);
};

export default Pending;
