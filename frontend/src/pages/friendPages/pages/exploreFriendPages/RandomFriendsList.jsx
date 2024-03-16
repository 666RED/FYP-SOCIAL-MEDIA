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

const RandomFriendsList = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const { randomFriendsArr, searchText, isLoadingFriend } = useSelector(
		(store) => store.friend
	);

	// get 15 random users
	useEffect(() => {
		const getRandomFriends = async () => {
			sliceDispatch(setIsLoadingFriend(true));
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

				sliceDispatch(setIsLoadingFriend(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				sliceDispatch(setIsLoadingFriend(false));
			}
		};

		getRandomFriends();
	}, []);

	return (
		<div className="px-2 mt-3 grid grid-cols-12 md:gap-x-2">
			{isLoadingFriend ? (
				<div className="mt-4">
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
