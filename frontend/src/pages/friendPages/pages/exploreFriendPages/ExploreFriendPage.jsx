import { React, useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import RandomFriendsList from "./RandomFriendsList.jsx";
import Error from "../../../../components/Error.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import {
	addRandomFriendsArr,
	resetState,
	setHasRandomFriends,
	setRandomFriendsArr,
	setIsLoadingFriend,
} from "../../../../features/friendSlice.js";
import { ServerContext } from "../../../../App.js";
import {
	resetSearchText,
	setSearchText,
} from "../../../../features/searchSlice.js";
let currentRequest;

const ExploreFriendPage = () => {
	const serverURL = useContext(ServerContext);
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const {
		hasRandomFriends,
		randomFriendsArr,
		originalRandomFriendsArr,
		isLoadingFriend,
	} = useSelector((store) => store.friend);
	const { searchText } = useSelector((store) => store.search);
	const { user, token } = useSelector((store) => store.auth);
	const [loadMore, setLoadMore] = useState(false);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
			sliceDispatch(resetSearchText());
		};
	}, []);

	const handleOnChange = async (payload) => {
		try {
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

			const res = await fetch(
				// change later
				`${serverURL}/friend/get-searched-random-friends?userId=${user._id}&searchText=${payload}`,
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

			const { msg, randomFriends } = await res.json();

			if (msg === "Success") {
				if (randomFriends.length < 15) {
					sliceDispatch(setHasRandomFriends(false));
				} else {
					sliceDispatch(setHasRandomFriends(true));
				}

				sliceDispatch(setRandomFriendsArr(randomFriends));
			} else if (msg === "Stop searching") {
				sliceDispatch(setRandomFriendsArr(originalRandomFriendsArr));
				sliceDispatch(setHasRandomFriends(true));
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

	const handleLoadMore = async () => {
		setLoadMore(true);

		try {
			const res = await fetch(
				`${serverURL}/friend/get-random-friends?userId=${
					user._id
				}&randomFriendsArr=${JSON.stringify(randomFriendsArr)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, randomFriends } = await res.json();

			if (msg === "Success") {
				if (randomFriendsArr.length === 0) {
					sliceDispatch(setRandomFriendsArr(randomFriends));
				} else {
					sliceDispatch(addRandomFriendsArr(randomFriends));
				}

				if (randomFriends.length < 15) {
					sliceDispatch(setHasRandomFriends(false));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else if (msg === "Fail to retrieve users") {
				enqueueSnackbar("Fail to retrieve users", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	const handleLoadMoreSearch = async () => {
		setLoadMore(true);

		try {
			const res = await fetch(
				`${serverURL}/friend/load-searched-random-friends?userId=${
					user._id
				}&randomFriendsArr=${JSON.stringify(
					randomFriendsArr
				)}&searchText=${searchText}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, randomFriends } = await res.json();

			if (msg === "Success") {
				if (randomFriendsArr.length === 0) {
					sliceDispatch(setRandomFriendsArr(randomFriends));
				} else {
					sliceDispatch(addRandomFriendsArr(randomFriends));
				}

				if (randomFriends.length < 15) {
					sliceDispatch(setHasRandomFriends(false));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else if (msg === "Fail to retrieve users") {
				enqueueSnackbar("Fail to retrieve users", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	return user && token ? (
		<div className="page-layout-with-back-arrow mb-5">
			{/* HEADER */}
			<DirectBackArrowHeader destination="/friend" title="Explore friend" />
			{/* SEARCHBAR */}
			<div className="mt-3 mb-5">
				{/* change later */}
				<SearchBar
					func={handleOnChange}
					placeholderText="Search user"
					text={searchText}
				/>
			</div>
			{/* FRIENDS LIST */}
			<RandomFriendsList />
			{/* LOAD MORE BUTTON */}
			<LoadMoreButton
				handleLoadMore={
					searchText === "" ? handleLoadMore : handleLoadMoreSearch
				}
				hasComponent={hasRandomFriends}
				isLoadingComponent={isLoadingFriend}
				loadMore={loadMore}
			/>
		</div>
	) : (
		<Error />
	);
};

export default ExploreFriendPage;
