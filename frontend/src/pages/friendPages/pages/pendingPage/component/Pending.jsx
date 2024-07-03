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
		<div className="rounded-xl p-3 my-2 border border-gray-300 shadow-xl col-span-12 md:col-span-4 lg:col-span-3 flex flex-row md:flex-col items-center">
			{state.loading && <Spinner />}
			{/* IMAGE */}
			<img
				src={profileImagePath}
				alt="User profile image"
				className={`border-[2.5px] md:border-4 ${pending.receiverId.userProfile.profileFrameColor} rounded-full w-16 md:w-32 h-16 md:h-32 md:self-center`}
			/>
			<div className="flex-1 flex flex-col w-full justify-between ml-3 md:ml-0 md:mt-3">
				{/* USER NAME */}
				<div className="md:text-xl md:mx-auto flex mb-2">
					<p
						className="cursor-pointer hover:opacity-80"
						onClick={handleNavigate}
					>
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
				<div>
					{state.isPending ? (
						// PENDING BUTTON
						<button
							className="btn-yellow mr-3 min-w-24 md:flex-1 md:w-full"
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
		</div>
	);
};

export default Pending;
