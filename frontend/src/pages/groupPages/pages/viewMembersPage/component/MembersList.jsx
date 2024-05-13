import { React, useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../components/Spinner/Loader.jsx";
import Member from "../component/Member.jsx";
import LoadMoreButton from "../../../../../components/LoadMoreButton.jsx";
import {
	appendMembers,
	firstRenderViewMembers,
	setHasMembers,
	setIsLoadingMembers,
} from "../../../../../features/groupMemberSlice.js";
import { ServerContext } from "../../../../../App.js";

const MembersList = ({ setLoading }) => {
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { groupId } = useParams();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { numberOfMembers, isLoadingMembers, membersArr, hasMembers } =
		useSelector((store) => store.groupMember);
	const { searchText } = useSelector((store) => store.search);
	const [loadMore, setLoadMore] = useState(false);

	// retrieve members info
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				setLoading(true);
				sliceDispatch(setIsLoadingMembers(true));

				const res = await fetch(
					`${serverURL}/group/get-members?groupId=${groupId}&membersArr=${JSON.stringify(
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
					sliceDispatch(setIsLoadingMembers(true));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnMembersArr, numberOfMembers } = await res.json();

				if (msg === "Success") {
					sliceDispatch(
						firstRenderViewMembers({ returnMembersArr, numberOfMembers })
					);
					if (returnMembersArr.length < 10) {
						sliceDispatch(setHasMembers(false));
					} else {
						sliceDispatch(setHasMembers(true));
					}
				} else if (msg === "Group not found") {
					enqueueSnackbar("Group not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				sliceDispatch(setIsLoadingMembers(false));
			} catch (err) {
				setLoading(false);
				sliceDispatch(setIsLoadingMembers(false));
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};

		fetchMembers();
	}, []);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/group/get-members?groupId=${groupId}&membersArr=${JSON.stringify(
					membersArr.map((member) => member._id)
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

			const { msg, returnMembersArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendMembers(returnMembersArr));

				if (returnMembersArr.length < 10) {
					sliceDispatch(setHasMembers(false));
				} else {
					sliceDispatch(setHasMembers(true));
				}
			} else if (msg === "Group not found") {
				enqueueSnackbar("Group not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			setLoadMore(false);
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	const handleLoadMoreSearch = async () => {
		try {
			setLoadMore(true);
			const res = await fetch(
				`${serverURL}/group/get-searched-members?groupId=${groupId}&searchText=${searchText}&membersArr=${JSON.stringify(
					membersArr.map((member) => member._id)
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

			const { msg, returnMembersArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(appendMembers(returnMembersArr));
				if (returnMembersArr.length < 10) {
					sliceDispatch(setHasMembers(false));
				} else {
					sliceDispatch(setHasMembers(true));
				}
			} else if (msg === "Group not found") {
				enqueueSnackbar("Group not found", {
					variant: "error",
				});
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
		<div className="mt-3">
			{/* NUMBER OF MEMBERS */}
			<p className="text-lg">
				{numberOfMembers} {numberOfMembers > 1 ? "members" : "member"}
			</p>
			{/* HORIZONTAL LINE */}
			<hr className="my-3 border-2 border-gray-500" />
			<div className="mt-4 min-[500px]:max-h-[26rem] max-h-[32rem] overflow-y-auto">
				{isLoadingMembers ? (
					<Loader />
				) : membersArr.length !== 0 ? (
					<div>
						{membersArr.map((member) => (
							<Member key={member._id} member={member} />
						))}
						{/* LOAD MORE BUTTON */}
						<LoadMoreButton
							handleLoadMore={
								searchText === "" ? handleLoadMore : handleLoadMoreSearch
							}
							hasComponent={hasMembers}
							isLoadingComponent={isLoadingMembers}
							loadMore={loadMore}
						/>
					</div>
				) : searchText === "" ? (
					<h2>No member</h2>
				) : (
					<h2>No result</h2>
				)}
			</div>
		</div>
	);
};

export default MembersList;
