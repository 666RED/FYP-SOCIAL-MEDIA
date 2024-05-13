import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import PendingList from "./component/PendingList.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import {
	setHasPendings,
	addPendingsArr,
} from "../../../../features/friendSlice.js";
import { ServerContext } from "../../../../App.js";

const PendingPage = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const { hasPendings, isLoadingPendings, pendingsArr } = useSelector(
		(store) => store.friend
	);
	const [loadMore, setLoadMore] = useState(false);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${serverURL}/friend-request/get-pending-friend-requests?requestorId=${
					user._id
				}&pendings=${JSON.stringify(pendingsArr)}`,
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
				sliceDispatch(addPendingsArr(returnFriendRequests));
				if (returnFriendRequests.length < 10) {
					sliceDispatch(setHasPendings(false));
				} else {
					sliceDispatch(setHasPendings(true));
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
			<DirectBackArrowHeader
				destination="/friend"
				title="Pending friend request"
			/>
			<div className="overflow-y-auto overflow-x-hidden max-h-[42rem] min-[500px]:max-h-[35rem] pb-2">
				{/* PENDING LIST */}
				<PendingList />
				{/* LOAD MORE BUTTON */}
				<LoadMoreButton
					handleLoadMore={handleLoadMore}
					hasComponent={hasPendings}
					isLoadingComponent={isLoadingPendings}
					loadMore={loadMore}
				/>
			</div>
		</div>
	) : (
		<Error />
	);
};

export default PendingPage;
