import {
	React,
	useEffect,
	useContext,
	useState,
	useReducer,
	useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import EditText from "./components/EditText.jsx";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";
import {
	editProfileReducer,
	INITIAL_STATE,
} from "./features/editProfileReducer.js";
import { ACTION_TYPES } from "./actionTypes/editProfileActionTypes.js";
import { ServerContext } from "../../App.js";
import { updateUserInfo } from "../../features/authSlice.js";

const EditProfile = () => {
	const firstRender = useRef(true);
	const navigate = useNavigate();
	const authDispatch = useDispatch();
	const [state, dispatch] = useReducer(editProfileReducer, INITIAL_STATE);

	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [profileImage, setProfileImage] = useState({});
	const [coverImage, setCoverImage] = useState({});

	const { enqueueSnackbar } = useSnackbar();
	const filePath = `${serverURL}/public/images/profile/`;

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			try {
				const res = await fetch(`${serverURL}/profile`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userId: user._id,
					}),
				});

				if (!res.ok) {
					if (res.status == 403) {
						enqueueSnackbar("Access Denied", {
							variant: "error",
						});
					} else {
						enqueueSnackbar("Server Error", {
							variant: "error",
						});
					}
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
						type: ACTION_TYPES.SET_PROFILE_IMAGE_PATH,
						payload: filePath + userProfile.profileImagePath,
					});
					dispatch({
						type: ACTION_TYPES.SET_COVER_IMAGE_PATH,
						payload: filePath + userProfile.profileCoverImagePath,
					});

					dispatch({ type: ACTION_TYPES.SET_NAME, payload: userInfo.userName });
					dispatch({
						type: ACTION_TYPES.SET_BIO,
						payload: userProfile.profileBio,
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
		fetchData();
	}, []);

	const handleSave = async () => {
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const formdata = new FormData();
			formdata.append("profileImage", profileImage);
			formdata.append("coverImage", coverImage);
			formdata.append("userId", user._id);
			formdata.append("userName", state.name);
			formdata.append("bio", state.bio);

			await fetch(`${serverURL}/profile/edit-profile`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formdata,
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "User not found") {
						enqueueSnackbar("User not found", {
							variant: "error",
						});
					} else if (data.msg === "Success") {
						enqueueSnackbar("Profile updated", {
							variant: "success",
						});
						authDispatch(
							updateUserInfo({
								name: state.name,
								bio: state.bio,
								profileImagePath: state.profileImagePath,
								coverImagePage: state.coverImagePath,
							})
						);
						navigate("/profile");
					}
				});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			console.log(err);

			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleProfileImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const image = new Image();

			image.onload = () => {
				// Check if the image is square

				if (Math.abs(image.width - image.height) < 30) {
					dispatch({
						type: ACTION_TYPES.SET_PROFILE_IMAGE_PATH,
						payload: URL.createObjectURL(file),
					});
					setProfileImage(file);
					dispatch({ type: ACTION_TYPES.MADE_CHANGES });
				} else {
					enqueueSnackbar("Please choose a square image", {
						variant: "warning",
					});
				}
			};

			image.src = URL.createObjectURL(file);
		}
	};

	const handleCoverImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			dispatch({
				type: ACTION_TYPES.SET_COVER_IMAGE_PATH,
				payload: URL.createObjectURL(file),
			});
			dispatch({ type: ACTION_TYPES.MADE_CHANGES });
			setCoverImage(file);
		}
	};

	return (
		<div className="mx-3 mt-2">
			{state.loading && <Spinner />}
			<BackArrow destination="/profile" discardChanges={state.makeChanges} />
			<div className="mt-2">
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
					className="rounded-full
              w-1/4 lg:w-1/6 mx-auto block border border-blue-400"
				/>
				<hr className="my-5 border border-gray-300" />
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
								dispatch({ type: ACTION_TYPES.MADE_CHANGES });
							}}
						/>
					</div>
					<hr className="md:hidden my-5 border border-gray-300 col-span-9" />
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
								dispatch({ type: ACTION_TYPES.MADE_CHANGES });
							}}
						/>
					</div>
				</div>
			</div>
			<button
				className="btn-green mt-8 block mx-auto w-1/2 md:w-1/4 mb-5"
				onClick={handleSave}
			>
				SAVE
			</button>
		</div>
	);
};

export default EditProfile;
