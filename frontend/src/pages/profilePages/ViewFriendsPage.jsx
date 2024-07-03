import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../components/BackArrow/DirectBackArrowHeader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import FriendsList from "./components/FriendsList.jsx";
import Error from "../../components/Error.jsx";
import {
	resetState,
	setFriendsArr,
	setHasFriends,
	setIsLoadingFriend,
} from "../../features/friendSlice.js";
import { ServerContext } from "../../App.js";
import { resetSearchText, setSearchText } from "../../features/searchSlice.js";
let currentRequest;

const ViewFriendsPage = () => {
	const sliceDispatch = useDispatch();
	const { userId } = useParams();
	const { originalFriendsArr, numberOfFriends } = useSelector(
		(store) => store.friend
	);
	const { searchText } = useSelector((store) => store.search);
	const { user, token } = useSelector((store) => store.auth);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
			sliceDispatch(resetSearchText());
		};
	}, []);

	const handleOnChange = async (payload) => {
		const abortController = new AbortController();
		const { signal } = abortController;

		// Cancel the previous request if it exists
		if (currentRequest) {
			currentRequest.abort();
		}

		// Store the current request to be able to cancel it
		currentRequest = abortController;

		sliceDispatch(setIsLoadingFriend(true));
		sliceDispatch(setSearchText(payload));

		try {
			const res = await fetch(
				`${serverURL}/friend/get-searched-friends?userId=${userId}&searchText=${payload.trim()}&friendIds=${JSON.stringify(
					[]
				)}`,
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

			const { msg, returnFriendsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setFriendsArr(returnFriendsArr));
				if (returnFriendsArr.length < 10) {
					sliceDispatch(setHasFriends(false));
				} else {
					sliceDispatch(setHasFriends(true));
				}
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
		<div className="page-layout-with-back-arrow flex flex-col h-full ">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination={`/profile/${userId}`}
				title="View friends"
			/>
			{/* SEARCH BAR */}
			<div className="middle-component my-3">
				<SearchBar
					func={handleOnChange}
					text={searchText}
					placeholderText="Search user"
					isDisabled={loading}
				/>
			</div>
			{/* NUMBER OF FRIENDS */}
			<p className="text-lg middle-component">
				{numberOfFriends} {numberOfFriends > 1 ? "friends" : "friend"}
			</p>
			{/* HORIZONTAL LINE */}
			<hr className="border-2 border-gray-500 middle-component my-2" />
			{/* FRIENDS LIST */}
			<FriendsList setLoading={setLoading} />
		</div>
	) : (
		<Error />
	);
};

export default ViewFriendsPage;
