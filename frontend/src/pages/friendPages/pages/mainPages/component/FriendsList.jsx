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
} from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";

const FriendsList = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendsArr, isLoadingFriend, searchText } = useSelector(
		(store) => store.friend
	);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const getFriends = async () => {
			try {
				sliceDispatch(setIsLoadingFriend(true));
				const res = await fetch(
					`${serverURL}/friend/get-friends?userId=${user._id}`,
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
					sliceDispatch(setOriginalFriendsArr(friendsArr));
					sliceDispatch(setFriendsArr(friendsArr));
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
		<div className="px-2 mt-3 grid grid-cols-12 md:gap-x-2">
			{isLoadingFriend ? (
				<div className="mt-4">
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
