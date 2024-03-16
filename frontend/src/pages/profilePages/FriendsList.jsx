import { React, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Friend from "./Friend.jsx";
import {
	setNumberOfFriends,
	setFriendsArr,
	setIsLoadingFriend,
	setOriginalFriendsArr,
} from "../../features/friendSlice.js";
import { ServerContext } from "../../App.js";
import Loader from "../../components/Spinner/Loader.jsx";

const FriendsList = () => {
	const sliceDispatch = useDispatch();
	const { userId } = useParams();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendsArr, numberOfFriends, isLoadingFriend, searchText } =
		useSelector((store) => store.friend);
	const { enqueueSnackbar } = useSnackbar();

	// retrieve friends info
	useEffect(() => {
		const getFriends = async () => {
			try {
				sliceDispatch(setIsLoadingFriend(true));
				const res = await fetch(
					`${serverURL}/friend/get-friends?userId=${userId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					sliceDispatch(setIsLoadingFriend(true));

					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, friendsArr } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setFriendsArr(friendsArr));
					sliceDispatch(setOriginalFriendsArr(friendsArr));
					sliceDispatch(setNumberOfFriends(friendsArr.length));
				} else if (msg === "User not found") {
					enqueueSnackbar("User not found", { variant: "error" });
				} else if (msg === "No friend") {
					sliceDispatch(setOriginalFriendsArr([]));
					sliceDispatch(setFriendsArr([]));
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

		getFriends();
	}, []);

	return (
		// change later the overflow feature
		<div className="mt-3 max-h-96 overflow-y-auto">
			<p className="text-lg">
				{numberOfFriends} {numberOfFriends > 1 ? "friends" : "friend"}
			</p>
			<hr className="my-3 border-2 border-gray-500" />
			{isLoadingFriend ? (
				<div className="mt-4">
					<Loader />
				</div>
			) : friendsArr.length > 0 ? (
				friendsArr.map((friend) => <Friend key={friend._id} friend={friend} />)
			) : searchText === "" ? (
				<h2>No friend</h2>
			) : (
				<h2>No result</h2>
			)}
		</div>
	);
};

export default FriendsList;
