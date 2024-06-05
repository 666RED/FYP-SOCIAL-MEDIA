import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../components/Spinner/Loader.jsx";
import RandomFriend from "./RandomFriend.jsx";
import {
	addOriginalRandomFriensArr,
	addRandomFriendsArr,
	setHasRandomFriends,
	setOriginalRandomFriendsArr,
	setRandomFriendsArr,
	setIsLoadingFriend,
} from "../../../../features/friendSlice.js";
import { ServerContext } from "../../../../App.js";
let currentRequest;

const RandomFriendsList = ({ setLoading }) => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const { randomFriendsArr, isLoadingFriend } = useSelector(
		(store) => store.friend
	);
	const { searchText } = useSelector((store) => store.search);

	// get 15 random users
	useEffect(() => {
		const getRandomFriends = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;
				currentRequest = abortController;

				setLoading(true);
				sliceDispatch(setIsLoadingFriend(true));

				const res = await fetch(
					`${serverURL}/friend/get-random-friends?userId=${
						user._id
					}&randomFriendIds=${JSON.stringify([])}`,
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
					setLoading(false);
					sliceDispatch(setIsLoadingFriend(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, randomFriends } = await res.json();

				if (msg === "Success") {
					if (randomFriendsArr.length === 0) {
						sliceDispatch(setRandomFriendsArr(randomFriends));
						sliceDispatch(setOriginalRandomFriendsArr(randomFriends));
					} else {
						sliceDispatch(addRandomFriendsArr(randomFriends));
						sliceDispatch(addOriginalRandomFriensArr(randomFriendsArr));
					}

					if (randomFriends.length < 15) {
						sliceDispatch(setHasRandomFriends(false));
					} else {
						sliceDispatch(setHasRandomFriends(true));
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

				setLoading(false);
				sliceDispatch(setIsLoadingFriend(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					setLoading(false);
					sliceDispatch(setIsLoadingFriend(false));
				}
			}
		};

		getRandomFriends();
	}, []);

	// cancel request
	useEffect(() => {
		return () => {
			if (currentRequest) {
				currentRequest.abort();
			}
		};
	}, []);

	return (
		<div className="px-2 mt-3 grid grid-cols-12 md:gap-x-2">
			{isLoadingFriend ? (
				<div className="mt-4 col-span-12">
					<Loader />
				</div>
			) : randomFriendsArr.length > 0 ? (
				randomFriendsArr.map((randomFriend) => (
					<RandomFriend key={randomFriend._id} randomFriend={randomFriend} />
				))
			) : searchText === "" ? (
				<h2 className="col-span-12">No friend</h2>
			) : (
				<h2 className="col-span-12">No result</h2>
			)}
		</div>
	);
};

export default RandomFriendsList;
