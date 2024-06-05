import { React, useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Friend from "./Friend.jsx";
import Loader from "../../../components/Spinner/Loader.jsx";
import LoadMoreButton from "../../../components/LoadMoreButton.jsx";
import {
	setNumberOfFriends,
	setFriendsArr,
	setIsLoadingFriend,
	setOriginalFriendsArr,
	setHasFriends,
	addFriendsArr,
} from "../../../features/friendSlice.js";
import { ServerContext } from "../../../App.js";

const FriendsList = ({ setLoading }) => {
	const sliceDispatch = useDispatch();
	const { userId } = useParams();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendsArr, numberOfFriends, isLoadingFriend, hasFriends } =
		useSelector((store) => store.friend);
	const { searchText } = useSelector((store) => store.search);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	// retrieve friends info
	useEffect(() => {
		const getFriends = async () => {
			try {
				setLoading(true);
				sliceDispatch(setIsLoadingFriend(true));
				const res = await fetch(
					`${serverURL}/friend/get-friends?userId=${userId}&friendIds=${JSON.stringify(
						[]
					)}`,
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
					sliceDispatch(setIsLoadingFriend(true));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnFriendsArr, numberOfFriends } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setFriendsArr(returnFriendsArr));
					sliceDispatch(setOriginalFriendsArr(returnFriendsArr));
					sliceDispatch(setNumberOfFriends(numberOfFriends));

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

				setLoading(false);
				sliceDispatch(setIsLoadingFriend(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
				sliceDispatch(setIsLoadingFriend(false));
			}
		};

		getFriends();
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/friend/get-friends?userId=${
					user._id
				}&friendIds=${JSON.stringify(friendsArr.map((friend) => friend._id))}`,
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

			const { msg, returnFriendsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addFriendsArr(returnFriendsArr));
				if (returnFriendsArr.length < 10) {
					sliceDispatch(setHasFriends(false));
				} else {
					sliceDispatch(setHasFriends(true));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
			} else if (msg === "No friend") {
				sliceDispatch(setFriendsArr([]));
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
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/friend/get-searched-friends?userId=${
					user._id
				}&searchText=${searchText.trim()}&friendIds=${JSON.stringify(
					friendsArr.map((friend) => friend._id)
				)}`,
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

			const { msg, returnFriendsArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addFriendsArr(returnFriendsArr));
				if (returnFriendsArr.length < 10) {
					sliceDispatch(setHasFriends(false));
				} else {
					sliceDispatch(setHasFriends(true));
				}
			} else if (msg === "User not found") {
				enqueueSnackbar("User not found", { variant: "error" });
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

	return (
		<div className="mt-3 min-[500px]:max-h-[31rem] max-h-[37rem] overflow-y-auto">
			{/* NUMBER OF FRIENDS */}
			<p className="text-lg">
				{numberOfFriends} {numberOfFriends > 1 ? "friends" : "friend"}
			</p>
			{/* HORIZONTAL LINE */}
			<hr className="my-3 border-2 border-gray-500" />
			{isLoadingFriend ? (
				<div className="mt-4">
					<Loader />
				</div>
			) : friendsArr.length > 0 ? (
				// FRIEND
				<div>
					{friendsArr.map((friend) => (
						<Friend key={friend._id} friend={friend} />
					))}
					{/* LOAD MORE BUTTON */}
					<LoadMoreButton
						handleLoadMore={
							searchText === "" ? handleLoadMore : handleLoadMoreSearch
						}
						hasComponent={hasFriends}
						isLoadingComponent={isLoadingFriend}
						loadMore={loadMore}
					/>
				</div>
			) : searchText === "" ? (
				<h2>No friend</h2>
			) : (
				<h2>No result</h2>
			)}
		</div>
	);
};

export default FriendsList;
