import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import FriendRequest from "./FriendRequest.jsx";
import { setFriendRequestsArr } from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";

const FriendRequestsList = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendRequestsArr } = useSelector((store) => store.friend);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const retrieveFriendRequests = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/friend-request/get-friend-requests?receiverId=${user._id}`,
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
					sliceDispatch(setFriendRequestsArr(returnFriendRequests));
				} else if (msg === "Friend requests not found") {
					enqueueSnackbar("Friend requests not found", { variant: "error" });
				} else if (msg === "No friend reqeust") {
					sliceDispatch(setFriendRequestsArr([]));
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

	return (
		<div className="my-5 grid grid-cols-12 gap-x-5">
			{loading ? (
				<Loader />
			) : friendRequestsArr.length > 0 ? (
				friendRequestsArr.map((friendRequest) => (
					<FriendRequest
						key={friendRequest._id}
						friendRequest={friendRequest}
					/>
				))
			) : (
				<h2 className="mt-5 col-span-12 text-center">No friend request</h2>
			)}
		</div>
	);
};

export default FriendRequestsList;
