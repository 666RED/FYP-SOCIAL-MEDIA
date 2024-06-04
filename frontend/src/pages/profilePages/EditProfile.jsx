import { React, useEffect, useContext, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import EditText from "../../components/EditText.jsx";
import Spinner from "../../components/Spinner/Spinner.jsx";
import Error from "../../components/Error.jsx";
import DirectBackArrowHeader from "../../components/BackArrow/DirectBackArrowHeader.jsx";
import {
	editProfileReducer,
	INITIAL_STATE,
} from "./features/editProfileReducer.js";
import { ACTION_TYPES } from "./actionTypes/editProfileActionTypes.js";
import { ServerContext } from "../../App.js";
import { setUser } from "../../features/authSlice.js";

const EditProfile = () => {
	const navigate = useNavigate();
	const authDispatch = useDispatch();
	const [state, dispatch] = useReducer(editProfileReducer, INITIAL_STATE);

	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [profileImage, setProfileImage] = useState({});
	const [coverImage, setCoverImage] = useState({});

	const { enqueueSnackbar } = useSnackbar();
	const filePath = `${serverURL}/public/images/profile/`;

	// fetch profile info
	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			try {
				const res = await fetch(`${serverURL}/profile?userId=${user._id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({
						type: ACTION_TYPES.SET_LOADING,
						payload: false,
					});
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, userInfo } = await res.json();

				if (msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else if (msg === "Success") {
					const userProfile = userInfo.userProfile;

					dispatch({
						type: ACTION_TYPES.FIEST_RENDER,
						payload: {
							profileImagePath: filePath + userProfile.profileImagePath,
							coverImagePath: filePath + userProfile.profileCoverImagePath,
							name: userInfo.userName,
							bio: userProfile.profileBio,
							frameColor: userProfile.profileFrameColor,
						},
					});
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			} catch (err) {
				enqueueSnackbar("Could not connect to server", {
					variant: "error",
				});
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		};
		if (user && token) {
			fetchData();
		}
	}, []);

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			if (state.name.trim() === "") {
				enqueueSnackbar("Please enter your name", { variant: "warning" });
				return;
			} else if (state.name.trim().length < 3) {
				enqueueSnackbar("Name should not less than 3 characters", {
					variant: "warning",
				});
				return;
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();
			formdata.append("profileImage", profileImage);
			formdata.append("coverImage", coverImage);
			formdata.append("userId", user._id);
			formdata.append("userName", state.name.trim());
			formdata.append("bio", state.bio.trim());

			const res = await fetch(`${serverURL}/profile/edit-profile`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formdata,
			});

			if (!res.ok && res.status === 403) {
				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const data = await res.json();

			if (data.msg === "User not found") {
				enqueueSnackbar("User not found", {
					variant: "error",
				});
			} else if (data.msg === "Success") {
				enqueueSnackbar("Profile updated", {
					variant: "success",
				});

				// update auth state
				authDispatch(setUser({ user: data.user, token: token }));
				navigate(`/profile/${user._id}`);
			} else {
				enqueueSnackbar("An error occurred", {
					variant: "error",
				});
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleProfileImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const ratio = img.width / img.height;
					if (ratio <= 12 / 9) {
						dispatch({
							type: ACTION_TYPES.SET_PROFILE_IMAGE_PATH,
							payload: URL.createObjectURL(file),
						});
						setProfileImage(file);
					} else {
						enqueueSnackbar("The image ratio is not within 12/9", {
							variant: "warning",
						});
					}
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCoverImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			dispatch({
				type: ACTION_TYPES.SET_COVER_IMAGE_PATH,
				payload: URL.createObjectURL(file),
			});
			setCoverImage(file);
		}
	};

	return user && token ? (
		<form className="page-layout-with-back-arrow" onSubmit={handleSave}>
			{state.loading && <Spinner />}
			{/* HEADER */}
			<DirectBackArrowHeader
				destination={`/profile/${user._id}`}
				title="Edit Profile"
				discardChanges={state.makeChanges}
			/>
			<div className="mt-2">
				{/* PROFILE PICTURE */}
				<div className="flex items-center justify-between mb-3">
					<h3>Profile Picture</h3>
					<EditText forInput="profileImageInput" />
					<input
						type="file"
						id="profileImageInput"
						accept="image/*"
						onChange={handleProfileImageChange}
						className="hidden"
					/>
				</div>
				<img
					src={state.profileImagePath}
					alt="Profile image"
					className={`rounded-full border-4 ${state.frameColor} object-cover mx-auto h-40 w-40 md:h-56 md:w-56`}
				/>
				<hr className="my-5 border border-gray-300" />
				{/* COVER IMAGE */}
				<div className="flex items-center justify-between mb-3">
					<h3>Cover Image</h3>
					<EditText forInput="coverImageInput" />
					<input
						type="file"
						id="coverImageInput"
						accept="image/*"
						onChange={handleCoverImageChange}
						className="hidden"
					/>
				</div>
				<img
					src={state.coverImagePath}
					alt="Cover image"
					className="rounded-xl w-full md:w-2/3 block mx-auto"
				/>
				<hr className="my-5 border border-gray-300" />
				<div className="grid grid-cols-9">
					{/* USER NAME */}
					<div className="md:col-span-4 col-span-9">
						<div className="flex items-center justify-between mb-3">
							<h3>Name</h3>
							<p
								className="text-lg text-blue-600 cursor-pointer hover:opacity-80"
								onClick={() =>
									dispatch({ type: ACTION_TYPES.TOGGLE_IS_NAME_EDIT })
								}
							>
								Edit
							</p>
						</div>
						<textarea
							required
							minLength={3}
							maxLength={50}
							rows="4"
							className={`border ${
								state.isNameEdit
									? "border-gray-600 text-black"
									: "border-gray-300 text-gray-500"
							} py-1 px-2 rounded-xl w-full resize-none`}
							readOnly={!state.isNameEdit}
							disabled={!state.isNameEdit}
							value={state.name}
							onChange={(e) => {
								dispatch({
									type: ACTION_TYPES.SET_NAME,
									payload: e.target.value,
								});
							}}
						/>
					</div>
					<hr className="md:hidden my-5 border border-gray-300 col-span-9" />
					{/* BIO */}
					<div className="md:col-start-6 md:col-span-4 col-span-9">
						<div className="flex items-center justify-between mb-3">
							<h3>Bio</h3>
							<p
								className="text-lg text-blue-600 cursor-pointer hover:opacity-80"
								onClick={() =>
									dispatch({ type: ACTION_TYPES.TOGGLE_IS_BIO_EDIT })
								}
							>
								Edit
							</p>
						</div>
						<textarea
							maxLength={200}
							rows="4"
							className={`border ${
								state.isBioEdit
									? "border-gray-600 text-black"
									: "border-gray-300 text-gray-500"
							} py-1 px-2 rounded-xl w-full resize-none`}
							readOnly={!state.isBioEdit}
							disabled={!state.isBioEdit}
							value={state.bio}
							onChange={(e) => {
								dispatch({
									type: ACTION_TYPES.SET_BIO,
									payload: e.target.value,
								});
							}}
						/>
					</div>
				</div>
			</div>
			<button className="btn-green mt-8 block mx-auto w-1/2 md:w-1/4 mb-5">
				SAVE
			</button>
		</form>
	) : (
		<Error />
	);
};

export default EditProfile;
