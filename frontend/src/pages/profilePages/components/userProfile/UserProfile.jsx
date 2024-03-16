import { React, useEffect, useContext, useReducer, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FaUserFriends } from "react-icons/fa";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import Loader from "../../../../components/Spinner/Loader.jsx";
import FriendStatusButton from "../../../../components/FriendStatusButton.jsx";
import Filter from "../../../../components/Filter.jsx";
import FormHeader from "../../../../components/FormHeader.jsx";
import {
	userProfileReducer,
	INITIAL_STATE,
} from "../../features/userProfileReducer.js";
import { ACTION_TYPES } from "../../actionTypes/userProfileActionTypes.js";
import { ServerContext } from "../../../../App.js";
import { setShowAddNewPostForm } from "../../features/userPosts/userPostSlice.js";
import { setUserFriendsMap } from "../../../../features/authSlice.js";

const UserProfile = () => {
	const { userId } = useParams();

	const sliceDispatch = useDispatch();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(userProfileReducer, INITIAL_STATE);

	const { user, token } = useSelector((store) => store.auth);
	const serverURL = useContext(ServerContext);

	const filePath = `${serverURL}/public/images/profile/`;

	// set up user profile info
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (userId === user._id) {
					// visit own profile
					dispatch({ type: ACTION_TYPES.SET_IS_USER, payload: true });
					const name = user.userName;

					const userProfile = user.userProfile;
					const profileImagePath = userProfile.profileImagePath;
					const coverImagePath = userProfile.profileCoverImagePath;
					const profileBio = userProfile.profileBio;

					dispatch({
						type: ACTION_TYPES.FETCH_DATA,
						payload: {
							name,
							profileImagePath: filePath + profileImagePath,
							coverImagePath: filePath + coverImagePath,
							bio: profileBio,
						},
					});
				} else {
					// visit another user profile
					dispatch({ type: ACTION_TYPES.SET_IS_USER, payload: false });
					dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
					const res = await fetch(`${serverURL}/profile?userId=${userId}`, {
						method: "GET",
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

					const { msg, userInfo } = await res.json();

					if (msg === "Success") {
						const { userName, userProfile } = userInfo;
						const { profileImagePath, profileBio, profileCoverImagePath } =
							userProfile;
						dispatch({
							type: ACTION_TYPES.FETCH_DATA,
							payload: {
								name: userName,
								profileImagePath: filePath + profileImagePath,
								coverImagePath: filePath + profileCoverImagePath,
								bio: profileBio,
							},
						});
						if (userInfo.userFriendsMap.hasOwnProperty(user._id)) {
							// they are friends
							dispatch({
								type: ACTION_TYPES.SET_FRIEND_STATUS,
								payload: "Friend",
							});
						} else {
							dispatch({
								type: ACTION_TYPES.SET_FRIEND_STATUS,
								payload: "Friend",
							});
						}
						dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
					} else if (msg === "User not found") {
						enqueueSnackbar("Fail to load user info", {
							variant: "error",
						});
					} else {
						enqueueSnackbar("An error occurred", {
							variant: "error",
						});
					}
				}
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		};
		fetchData();
	}, [userId]);

	// get friend status
	useEffect(() => {
		const fetchFriendStatus = async () => {
			dispatch({ type: ACTION_TYPES.SET_LOAD_FRIEND_STATUS, payload: true });
			try {
				const res = await fetch(
					`${serverURL}/friend-request/get-friend-request?requestorId=${user._id}&receiverId=${userId}`,
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

				const response = await res.json();

				if (response.msg === "No request") {
					dispatch({
						type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
						payload: { friendStatus: "Not friend", friendRequest: {} },
					});
				} else if (response.msg === "Sent friend request") {
					dispatch({
						type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
						payload: {
							friendStatus: "Pending",
							friendRequest: response.returnFriendRequest,
						},
					});
				} else if (response.msg === "Received friend request") {
					dispatch({
						type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
						payload: {
							friendStatus: "Confirm",
							friendRequest: response.returnFriendRequest,
						},
					});
				} else if (response.msg === "Already friend") {
					dispatch({
						type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
						payload: {
							friendStatus: "Friend",
							friendRequest: response.returnFriendRequest,
						},
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
				dispatch({
					type: ACTION_TYPES.SET_LOAD_FRIEND_STATUS,
					payload: false,
				});
			} catch (err) {
				dispatch({
					type: ACTION_TYPES.SET_LOAD_FRIEND_STATUS,
					payload: false,
				});
			}
		};
		fetchFriendStatus();
	}, [userId]);

	const handleAddFriend = async () => {
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		try {
			const res = await fetch(
				`${serverURL}/friend-request/send-friend-request`,
				{
					method: "POST",
					body: JSON.stringify({
						requestorId: user._id,
						receiverId: userId,
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
					type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
					payload: {
						friendStatus: "Pending",
						friendRequest: response.savedFriendRequest,
					},
				});
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
						type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
						payload: { friendStatus: "Not friend", friendRequest: {} },
					});
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

	const handleAcceptRequest = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const res = await fetch(
				`${serverURL}/friend-request/accept-friend-request`,
				{
					method: "PATCH",
					body: JSON.stringify({
						requestorId: userId,
						receiverId: user._id,
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

			const { msg, updatedFriendRequest, updatedUser } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Friend request accepted", { variant: "success" });
				dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_RESPOND_FORM });
				dispatch({
					type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
					payload: {
						friendStatus: "Friend",
						friendRequest: updatedFriendRequest,
					},
				});
				sliceDispatch(setUserFriendsMap(updatedUser.userFriendsMap));
			} else if (msg === "Friend not found" || msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else if (msg === "Friend request not found or already accepted") {
				enqueueSnackbar("Request already accepted", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", {
					variant: "error",
				});
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleRejectRequest = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const res = await fetch(
				`${serverURL}/friend-request/reject-friend-request`,
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

			const { msg } = await res.json();

			if (msg === "Success") {
				dispatch({
					type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
					payload: { friendStatus: "Not friend", friendRequest: {} },
				});
				dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_RESPOND_FORM });

				enqueueSnackbar("Friend request rejected", { variant: "success" });
			} else if (msg === "Friend request not found") {
				enqueueSnackbar("Fail to reject friend request", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });

			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	const handleRemoveFriend = async () => {
		try {
			const ans = window.confirm("Remove friend?");
			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const res = await fetch(`${serverURL}/friend/remove-friend`, {
					method: "DELETE",
					body: JSON.stringify({
						requestorId: user._id,
						receiverId: userId,
						friendRequestId: state.friendRequest._id,
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

				const response = await res.json();

				if (response.msg === "Success") {
					enqueueSnackbar("Friend removed", {
						variant: "success",
					});
					dispatch({
						type: ACTION_TYPES.SET_FRIEND_STATUS_AND_REQUEST,
						payload: { friendStatus: "Not friend", friendRequest: {} },
					});
					sliceDispatch(setUserFriendsMap(response.updatedUser.userFriendsMap));
				} else if (response.msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else if (response.msg === "Friend not found") {
					enqueueSnackbar("Friend not found", {
						variant: "error",
					});
				} else if (response.msg === "Friend request not found") {
					enqueueSnackbar("Friend request not found", {
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

	return (
		<div>
			{state.loading && <Spinner />}
			{/* RESPOND FORM */}
			{state.showRespondForm && (
				<div>
					<Filter />
					<div className="center-container">
						<div className="form pb-5">
							<FormHeader
								closeFunction={() =>
									dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_RESPOND_FORM })
								}
								title="Respond request"
							/>
							<p>Choose to accept or reject the friend request</p>
							<div className="flex items-center justify-around mt-5">
								<button
									className="btn-green w-1/3"
									onClick={handleAcceptRequest}
								>
									Accept
								</button>
								<button className="btn-red w-1/3" onClick={handleRejectRequest}>
									Reject
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="page-design">
				{/* COVER IMAGE */}
				<img
					src={state.coverImagePath}
					alt="Profile cover photo"
					className="rounded-xl mt-3 component-layout"
				/>
				<div className="component-layout my-3 shadow-xl rounded-xl py-3 bg-white grid grid-cols-12 items-center">
					<div className="flex flex-col items-center justify -center col-span-5">
						{/* PROFILE IMAGE */}
						<img
							src={state.profileImagePath}
							alt="Profile picture"
							className="rounded-full md:w-36 w-28 border border-blue-400"
						/>
						{/* USER NAME */}
						<p className="my-3 md:text-xl text-lg font-semibold">
							{state.name}
						</p>
					</div>
					<div className="flex flex-col col-span-5 col-start-7">
						{/* EDIT PROFILE BUTTON */}
						{state.isUser && (
							<button
								className="btn-green my-2 text-sm sm:text-base"
								onClick={() => navigate("/profile/edit-profile")}
							>
								Edit Profile
							</button>
						)}
						{/* ADD NEW POST BUTTON */}
						{state.isUser && (
							<button
								className="btn-blue my-2 text-sm sm:text-base"
								onClick={() => sliceDispatch(setShowAddNewPostForm(true))}
							>
								Add New Post
							</button>
						)}
						{/* FRIEND STATUS BUTTON */}
						{!state.isUser && // visitor
							(state.loadFriendStatus ? ( // retrieving friend status
								<Loader />
							) : (
								<FriendStatusButton
									friendStatus={state.friendStatus}
									functions={{
										handleAddFriend,
										handleCancelRequest,
										toggleShowRespondForm: () =>
											dispatch({
												type: ACTION_TYPES.TOGGLE_SHOW_RESPOND_FORM,
											}),
										handleRemoveFriend,
									}}
								/>
							))}
						{/* VIEW FRIENDS BUTTON */}
						<button
							className="btn-gray profile-btn my-2"
							onClick={() => navigate(`/profile/view-friends/${userId}`)}
						>
							<FaUserFriends className="profile-btn-icon" />
							View Friends
						</button>
					</div>
				</div>
				<hr />
				{/* PROFILE BIO */}
				<p className="shadow-2xl bg-white p-2 rounded-xl text-black md:w-7/12 w-full mx-auto">
					{state.bio}
				</p>
			</div>
		</div>
	);
};

export default UserProfile;
