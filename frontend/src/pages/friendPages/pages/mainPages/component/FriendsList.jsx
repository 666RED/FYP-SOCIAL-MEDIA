import { React, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import Friend from "./Friend.jsx";
import {
	setIsLoadingFriend,
	setFriendsArr,
	setNumberOfFriends,
	setOriginalFriendsArr,
	setHasFriends,
} from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";

const FriendsList = ({ setListLoading }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendsArr, isLoadingFriend } = useSelector((store) => store.friend);
	const { searchText } = useSelector((store) => store.search);
	const { enqueueSnackbar } = useSnackbar();
	let currentRequest;

	// get 10 friends
	useEffect(() => {
		const getFriends = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;
				currentRequest = abortController;

				setListLoading(true);
				sliceDispatch(setIsLoadingFriend(true));
				const res = await fetch(
					`${serverURL}/friend/get-friends?userId=${
						user._id
					}&friends=${JSON.stringify([])}`,
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
					setListLoading(false);
					sliceDispatch(setIsLoadingFriend(true));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnFriendsArr, numberOfFriends } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setOriginalFriendsArr(returnFriendsArr));
					sliceDispatch(setFriendsArr(returnFriendsArr));
					sliceDispatch(setNumberOfFriends(Number(numberOfFriends)));
					if (returnFriendsArr.length < 10) {
						sliceDispatch(setHasFriends(false));
					} else {
						sliceDispatch(setHasFriends(true));
					}
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", { variant: "error" });
				} else if (msg === "No friend") {
					sliceDispatch(setOriginalFriendsArr([]));
					sliceDispatch(setFriendsArr([]));
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setListLoading(false);
				sliceDispatch(setIsLoadingFriend(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					setListLoading(false);
					sliceDispatch(setIsLoadingFriend(false));
				}
			}
		};

		getFriends();

		// cancel request
		return () => {
			if (currentRequest) {
				currentRequest.abort();
			}
		};
	}, []);

	return (
		<div className="px-2 mt-3 grid grid-cols-12 md:gap-x-2 overflow-y-auto">
			{isLoadingFriend ? (
				<div className="mt-4 col-span-12">
					<Loader />
				</div>
			) : friendsArr.length > 0 ? (
				friendsArr.map((friend) => <Friend key={friend._id} friend={friend} />)
			) : searchText === "" ? (
				<h2 className="col-span-12">No friend</h2>
			) : (
				<h2 className="col-span-12">No result</h2>
			)}
		</div>
	);
};

export default FriendsList;
