import { React, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Error from "../../../../components/Error.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import Header from "../../../../components/Header.jsx";
import SideBar from "../../../../components/Sidebar/SideBar.jsx";
import FriendsList from "./component/FriendsList.jsx";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../../App.js";
import {
	resetState,
	setFriendsArr,
	setIsLoadingFriend,
} from "../../../../features/friendSlice.js";
import {
	resetSearchText,
	setSearchText,
} from "../../../../features/searchSlice.js";
let currentRequest;

const FriendPage = () => {
	const navigate = useNavigate();
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { numberOfFriends, originalFriendsArr } = useSelector(
		(store) => store.friend
	);
	const { searchText } = useSelector((store) => store.search);
	const [extendSideBar, setExtendSideBar] = useState(false);
	const [loading, setLoading] = useState(false);
	const [numFriendRequests, setNumFriendRequests] = useState(0);
	const [numPending, setNumPending] = useState(0);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
			sliceDispatch(resetSearchText());
		};
	}, []);

	// retrieve friend request and reset state
	useEffect(() => {
		const retrieveFriendRequests = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/friend-request/get-friend-requests-amount?receiverId=${user._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnFriendRequests } = await res.json();

				if (msg === "Success") {
					setNumFriendRequests(returnFriendRequests.length);
				} else if (msg === "Friend requests not found") {
					enqueueSnackbar("Friend requests not found", { variant: "error" });
				} else if (msg === "No friend reqeust") {
					setNumFriendRequests(0);
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};

		retrieveFriendRequests();
	}, []);

	// retrieve pending
	useEffect(() => {
		const retrievePending = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/friend-request/get-pending-friend-requests-amount?requestorId=${user._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnFriendRequests } = await res.json();

				if (msg === "Success") {
					setNumPending(returnFriendRequests.length);
				} else if (msg === "Friend requests not found") {
					enqueueSnackbar("Friend requests not found", { variant: "error" });
				} else if (msg === "No pending friend reqeust") {
					setNumPending(0);
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};

		retrievePending();

		return () => {
			sliceDispatch(resetState());
		};
	}, []);

	const handleOnChange = async (payload) => {
		const abortController = new AbortController();
		const { signal } = abortController;

		// Cancel the previous request if it exists
		if (currentRequest) {
			currentRequest.abort();
		}

		// Store the current request to be able to cancel it later
		currentRequest = abortController;

		sliceDispatch(setIsLoadingFriend(true));
		sliceDispatch(setSearchText(payload));

		try {
			const res = await fetch(
				`${serverURL}/friend/get-searched-friends?userId=${user._id}&searchText=${payload}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				}
			);

			if (!res.ok && res.status === 403) {
				sliceDispatch(setIsLoadingFriend(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, friendsArray } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setFriendsArr(friendsArray));
			} else if (msg === "Stop searching") {
				sliceDispatch(setFriendsArr(originalFriendsArr));
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingFriend(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	return user && token ? (
		<div className="py-2">
			{loading && <Spinner />}
			{/* SIDEBAR */}
			{extendSideBar && (
				<SideBar selectedSection="Friend" setExtendSideBar={setExtendSideBar} />
			)}
			{/* HEADER */}
			<Header
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				title="Friend"
			/>
			{/* MAIN CONTENT */}
			{/* NAV BUTTONS */}
			<div className="pl-2 pr-3 mt-3 w-full grid grid-cols-11 gap-x-2 md:gap-x-5 text-sm md:text-base">
				{/* EXPLORE FRIEND BUTTON */}
				<button
					className="btn-green col-span-4 md:col-span-3 lg:col-span-2"
					onClick={() => navigate("/friend/explore-friend")}
				>
					Explore friend
				</button>
				{/* FRIEND REQUEST BUTTON */}
				<button
					className="btn-blue relative col-span-4 md:col-span-3 lg:col-span-2"
					onClick={() => navigate("/friend/friend-request")}
				>
					Friend request
					{numFriendRequests !== 0 && (
						<p className="absolute -top-3 -right-2 md:-right-4 rounded-full bg-red-500 w-6 md:w-8">
							{numFriendRequests}
						</p>
					)}
				</button>
				{/* PENDING BUTTON */}
				<button
					className="btn-yellow col-span-3 md:col-span-2 relative"
					onClick={() => navigate("/friend/friend-request-pending")}
				>
					Pending
					{numPending !== 0 && (
						<p className="absolute -top-3 -right-2 md:-right-4 rounded-full bg-red-500 w-6 md:w-8">
							{numPending}
						</p>
					)}
				</button>
			</div>
			<hr className="border-4 border-gray-400 my-3" />
			<div className="px-2 flex justify-between w-full items-center">
				{/* TITLE */}
				<h2>Your Friends ({numberOfFriends})</h2>
				{/* SEARCH BAR */}
				<SearchBar
					func={handleOnChange}
					placeholderText="Search user"
					text={searchText}
				/>
			</div>
			{/* FRIENDS LIST */}
			<FriendsList />
		</div>
	) : (
		<Error />
	);
};

export default FriendPage;
