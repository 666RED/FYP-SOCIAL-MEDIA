import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import Pending from "../component/Pending.jsx";
import { setPendingsArr } from "../../../../../features/friendSlice.js";
import { ServerContext } from "../../../../../App.js";

const PendingList = () => {
	const sliceDispatch = useDispatch();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { pendingsArr } = useSelector((store) => store.friend);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const retrievePendings = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/friend-request/get-pending-friend-requests?requestorId=${user._id}`,
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
					sliceDispatch(setPendingsArr(returnFriendRequests));
				} else if (msg === "Friend requests not found") {
					enqueueSnackbar("Friend requests not found", { variant: "error" });
				} else if (msg === "No pending friend reqeust") {
					sliceDispatch(setPendingsArr([]));
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

		retrievePendings();
	}, []);

	return (
		<div className="my-5 grid grid-cols-12 gap-x-5">
			{loading ? (
				<Loader />
			) : pendingsArr.length > 0 ? (
				pendingsArr.map((pending) => (
					<Pending key={pending._id} pending={pending} />
				))
			) : (
				<h2 className="mt-5 col-span-12 text-center">
					No pending friend request
				</h2>
			)}
		</div>
	);
};

export default PendingList;
