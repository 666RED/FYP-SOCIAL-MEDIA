import { React, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import FriendRequestsList from "./component/FriendRequestsList.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import {
	addFriendRequestsArr,
	setHasFriendRequests,
} from "../../../../features/friendSlice.js";
import { ServerContext } from "../../../../App.js";

const FriendRequestPage = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { friendRequestsArr, isLoadingFriendRequests, hasFriendRequests } =
		useSelector((store) => store.friend);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/friend-request/get-friend-requests?receiverId=${
					user._id
				}&requestIds=${JSON.stringify(
					friendRequestsArr.map((request) => request._id)
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

			const { msg, returnFriendRequests } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addFriendRequestsArr(returnFriendRequests));
				if (returnFriendRequests.length < 10) {
					sliceDispatch(setHasFriendRequests(false));
				} else {
					sliceDispatch(setHasFriendRequests(true));
				}
			} else if (msg === "Friend requests not found") {
				enqueueSnackbar("Friend requests not found", { variant: "error" });
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
		<div className="page-layout-with-back-arrow mb-3">
			{/* HEADER */}
			<DirectBackArrowHeader destination="/friend" title="Friend request" />
			<div className="overflow-y-auto overflow-x-hidden max-h-[42rem] min-[500px]:max-h-[35rem] pb-2">
				{/* FRIEND REQUESTS LIST */}
				<FriendRequestsList />
				{/* LOAD MORE BUTTON */}
				<LoadMoreButton
					handleLoadMore={handleLoadMore}
					hasComponent={hasFriendRequests}
					isLoadingComponent={isLoadingFriendRequests}
					loadMore={loadMore}
				/>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default FriendRequestPage;
