import { React, useContext, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import GroupProfile from "./component/GroupProfile.jsx";
import GroupPosts from "./component/posts/GroupPosts.jsx";
import LoadMoreButton from "../../../../components/LoadMoreButton.jsx";
import AddNewPostForm from "./component/posts/AddNewPostForm.jsx";
import {
	singleGroupPageReducer,
	INITIAL_STATE,
} from "./feature/singleGroupPageReducer.js";
import ACTION_TYPES from "./actionTypes/singleGroupPageActionTypes.js";
import {
	loadPost,
	resetGroupPostState,
	setHasPost,
} from "../../../../features/groupPostSlice.js";
import { setIsMember } from "../../../../features/groupSlice.js";
import { ServerContext } from "../../../../App.js";

const SingleGroupPage = () => {
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const sliceDispatch = useDispatch();
	const { groupId } = useParams();
	const { user, token } = useSelector((store) => store.auth);
	const { hasPost, isLoadingPosts } = useSelector((store) => store.groupPost);
	const { isMember } = useSelector((store) => store.group);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(singleGroupPageReducer, INITIAL_STATE);
	const currentTime = new Date();
	currentTime.setSeconds(currentTime.getSeconds() + 1);
	const updatedTime = currentTime.toUTCString();

	// determine if user is group member
	useEffect(() => {
		const fetchMemberStatus = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(
					`${serverURL}/group/get-member-status?groupId=${groupId}&userId=${user._id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					dispatch({
						type: ACTION_TYPES.SET_LOADING,
						payload: false,
					});
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, isMember } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setIsMember(isMember));
				} else if (msg === "Group not found") {
					enqueueSnackbar("Fail to retrieve member information", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			} catch (err) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};

		fetchMemberStatus();
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetGroupPostState());
		};
	}, []);

	const handleLoadMore = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_LOAD_MORE, payload: true });

			const res = await fetch(
				`${serverURL}/group-post/get-group-posts?groupId=${groupId}&count=${state.count}&currentTime=${updatedTime}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				dispatch({ type: ACTION_TYPES.SET_LOAD_MORE, payload: false });
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnGroupPosts } = await res.json();

			if (msg === "Success") {
				sliceDispatch(loadPost(returnGroupPosts));
				dispatch({ type: ACTION_TYPES.INCREASE_COUNT });

				if (returnGroupPosts.length < 10) {
					sliceDispatch(setHasPost(false));
				} else {
					sliceDispatch(setHasPost(true));
				}
			} else if (msg === "Fail to retrieve group posts") {
				enqueueSnackbar("Fail to retrieve group posts", { variant: "error" });
			} else if (msg === "No post") {
				sliceDispatch(setHasPost(false));
			}

			dispatch({ type: ACTION_TYPES.SET_LOAD_MORE, payload: false });
		} catch (err) {
			dispatch({ type: ACTION_TYPES.SET_LOAD_MORE, payload: false });
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return user && token ? (
		<div>
			{/* ADD NEW POST FORM */}
			{state.showAddNewPostForm && (
				<AddNewPostForm
					toggleShowAddNewPostForm={() =>
						dispatch({
							type: ACTION_TYPES.TOGGLE_SHOW_ADD_NEW_POST_FORM,
						})
					}
				/>
			)}
			{/* HEADER */}
			<div className="mx-3 my-3 bg-white">
				<DirectBackArrowHeader destination="/group" title="" />
			</div>
			<div className="page-design pb-3">
				{/* GROUP PROFILE */}
				<GroupProfile />
				{/* BUTTONS ROW */}
				{isMember && (
					<div className="grid grid-cols-12 gap-x-2 component-layout my-4">
						{/* ADD NEW POST BUTTON */}
						<button
							className="btn-green col-span-4 lg:col-span-3 text-xs min-[400px]:text-sm min-[800px]:text-base"
							onClick={() =>
								dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_ADD_NEW_POST_FORM })
							}
						>
							Add New Post
						</button>
						{/* YOUR POSTS BUTTON */}
						<button
							className="btn-gray col-span-4 lg:col-span-3 text-xs min-[400px]:text-sm min-[800px]:text-base"
							onClick={() => navigate(`/group/${groupId}/your-posts`)}
						>
							Your Posts
						</button>
						{/* NOTES BUTTON */}
						<button
							className="btn-blue col-span-4 lg:col-span-3 text-xs min-[400px]:text-sm min-[800px]:text-base lg:text-base"
							onClick={() => navigate("view-notes")}
						>
							Notes
						</button>
					</div>
				)}

				<hr className="border-4 border-gray-400 my-4" />
				{/* GROUP POSTS */}
				{isMember ? (
					<div>
						<GroupPosts currentTime={updatedTime} groupId={groupId} />
						{/* LOAD MORE BUTTON */}
						<LoadMoreButton
							handleLoadMore={handleLoadMore}
							hasComponent={hasPost}
							isLoadingComponent={isLoadingPosts}
							loadMore={state.loadMore}
						/>
					</div>
				) : (
					<h2 className="text-center mb-2">Join the group to view posts</h2>
				)}
			</div>
		</div>
	) : (
		<Error />
	);
};

export default SingleGroupPage;
