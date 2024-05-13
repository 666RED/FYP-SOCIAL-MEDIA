import { React, useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Error from "../../../../components/Error.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import MembersList from "./component/MembersList.jsx";
import { ServerContext } from "../../../../App.js";
import {
	resetGroupMemberState,
	setIsLoadingMembers,
	setMembersArr,
	setHasMembers,
} from "../../../../features/groupMemberSlice.js";
import {
	resetSearchText,
	setSearchText,
} from "../../../../features/searchSlice.js";
let currentRequest;

const ViewMembersPage = () => {
	const { groupId } = useParams();
	const sliceDispatch = useDispatch();
	const { searchText } = useSelector((store) => store.search);
	const { user, token } = useSelector((store) => store.auth);
	const { originalMembersArr } = useSelector((store) => store.groupMember);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetGroupMemberState());
			sliceDispatch(resetSearchText());
		};
	}, []);

	const handleOnChange = async (payload) => {
		const abortController = new AbortController();
		const { signal } = abortController;

		if (currentRequest) {
			currentRequest.abort();
		}

		currentRequest = abortController;

		sliceDispatch(setIsLoadingMembers(true));
		sliceDispatch(setSearchText(payload));

		try {
			const res = await fetch(
				`${serverURL}/group/get-searched-members?groupId=${groupId}&searchText=${payload.trim()}&membersArr=${JSON.stringify(
					[]
				)}`,
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
				sliceDispatch(setIsLoadingMembers(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnMembersArr } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setMembersArr(returnMembersArr));
				if (returnMembersArr.length < 10) {
					sliceDispatch(setHasMembers(false));
				} else {
					sliceDispatch(setHasMembers(true));
				}
			} else if (msg === "Stop searching") {
				sliceDispatch(setMembersArr(originalMembersArr));
				if (originalMembersArr.length === 10) {
					sliceDispatch(setHasMembers(true));
				}
			} else if (msg === "Group not found") {
				enqueueSnackbar("Group not found", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingMembers(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	return user && token ? (
		<div className="page-layout-with-back-arrow">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination={`/group/${groupId}`}
				title="View members"
			/>
			<div className="w-full md:w-2/3 md:mx-auto mt-5">
				{/* SEARCH BAR */}
				<div className="mt-3">
					<SearchBar
						func={handleOnChange}
						text={searchText}
						placeholderText="Search member"
						isDisabled={loading}
					/>
				</div>
				{/* MEMBERS LIST */}
				<MembersList setLoading={setLoading} />
			</div>
		</div>
	) : (
		<Error />
	);
};

export default ViewMembersPage;
