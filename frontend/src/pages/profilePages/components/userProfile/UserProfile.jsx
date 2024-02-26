import { React, useEffect, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
	userProfileReducer,
	INITIAL_STATE,
} from "../../features/userProfileReducer.js";
import { ACTION_TYPES } from "../../actionTypes/userProfileActionTypes.js";
import { ServerContext } from "../../../../App.js";
import { setShowAddNewPostForm } from "../../features/userProfilePageSlice.js";
import Spinner from "../../../../components/Spinner.jsx";

const UserProfile = () => {
	const sliceDispatch = useDispatch();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(userProfileReducer, INITIAL_STATE);

	const { user, token } = useSelector((store) => store.auth);
	const serverURL = useContext(ServerContext);

	const filePath = `${serverURL}/public/images/profile/`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
				const name = user.userName;

				const userProfile = user.userProfile;
				const profileImagePath = userProfile.profileImagePath;
				const coverImagePath = userProfile.profileCoverImagePath;
				const profileBio = userProfile.profileBio;

				dispatch({
					type: ACTION_TYPES.FETCH_DATA,
					payload: {
						name,
						profileImagePath: filePath + profileImagePath,
						coverImagePath: filePath + coverImagePath,
						bio: profileBio,
					},
				});
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			{state.loading && <Spinner />}
			<div className="px-3 py-2 bg-gray-200">
				<img
					src={state.coverImagePath}
					alt="Profile cover photo"
					className="rounded-xl w-full md:w-7/12 mt-3 mx-auto"
				/>
				<div className="w-full md:w-7/12 mx-auto my-3 shadow-xl rounded-xl py-3 bg-white grid grid-cols-12 items-center">
					<div className="flex flex-col items-center justify -center col-span-5">
						<img
							src={state.profileImagePath}
							alt="Profile picture"
							className="rounded-full md:w-36 w-28 border border-blue-400"
						/>
						<p className="my-3 md:text-lg text-sm font-semibold">
							{state.name}
						</p>
					</div>
					<div className="flex flex-col col-span-5 col-start-7">
						<button
							className="btn-green my-2 text-sm sm:text-base"
							onClick={() => navigate("/profile/edit-profile")}
						>
							Edit Profile
						</button>
						<button
							className="btn-blue my-2 text-sm sm:text-base"
							onClick={() => sliceDispatch(setShowAddNewPostForm(true))}
						>
							Add New Post
						</button>
						<button
							className="btn-gray my-2 text-sm sm:text-base"
							onClick={() => navigate("/profile/view-friends")}
						>
							View Friends
						</button>
					</div>
				</div>
				<hr />
				<p className="shadow-2xl bg-white p-2 rounded-xl text-black md:w-7/12 w-full mx-auto">
					{state.bio}
				</p>
			</div>
		</div>
	);
};

export default UserProfile;
