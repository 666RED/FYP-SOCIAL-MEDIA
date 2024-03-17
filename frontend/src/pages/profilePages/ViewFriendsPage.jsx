import { React, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../components/BackArrow/DirectBackArrowHeader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import FriendsList from "./FriendsList.jsx";
import Error from "../../components/Error.jsx";
import {
	resetState,
	setFriendsArr,
	setIsLoadingFriend,
} from "../../features/friendSlice.js";
import { ServerContext } from "../../App.js";
import { resetSearchText, setSearchText } from "../../features/searchSlice.js";
let currentRequest;

const ViewFriendsPage = () => {
	const sliceDispatch = useDispatch();
	const { userId } = useParams();
	const { originalFriendsArr } = useSelector((store) => store.friend);
	const { searchText } = useSelector((store) => store.search);
	const { user, token } = useSelector((store) => store.auth);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();

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

		// Store the current request to be able to cancel it later
		currentRequest = abortController;

		sliceDispatch(setIsLoadingFriend(true));
		sliceDispatch(setSearchText(payload));

		try {
			const res = await fetch(
				`${serverURL}/friend/get-searched-friends?userId=${userId}&searchText=${payload}`,
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
		<div className="page-layout-with-back-arrow">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination={`/profile/${userId}`}
				title="View friends"
			/>
			<div className="w-full md:w-2/3 md:mx-auto mt-5">
				{/* SEARCH BAR */}
				<div className="mt-3">
					<SearchBar
						func={handleOnChange}
						text={searchText}
						placeholderText="Search user"
					/>
				</div>
				{/* FRIENDS LIST */}
				<FriendsList />
			</div>
		</div>
	) : (
		<Error />
	);
};

export default ViewFriendsPage;
