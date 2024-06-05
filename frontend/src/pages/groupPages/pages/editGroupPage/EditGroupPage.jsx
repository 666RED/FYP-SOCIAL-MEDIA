import { React, useEffect, useContext, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import EditText from "../../../../components/EditText.jsx";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import Error from "../../../../components/Error.jsx";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import {
	editGroupPageReducer,
	INITIAL_STATE,
} from "./feature/editGroupPageReducer.js";
import ACTION_TYPES from "./actionTypes/editGroupPageActionTypes.js";
import { ServerContext } from "../../../../App.js";

const EditGroupPage = () => {
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(editGroupPageReducer, INITIAL_STATE);
	const { groupId } = useParams();

	// fetch group profile info
	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			try {
				const res = await fetch(
					`${serverURL}/group/get-group-info?groupId=${groupId}`,
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

				const { msg, returnedGroup } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.FIRST_RENDER,
						payload: { returnedGroup },
					});
				} else if (msg === "Group not found") {
					enqueueSnackbar("Group not found", { variant: "error" });
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

		fetchData();
	}, []);

	const handleGroupImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const ratio = img.width / img.height;
					if (ratio <= 12 / 9) {
						dispatch({
							type: ACTION_TYPES.UPDATE_GROUP_IMAGE,
							payload: {
								imagePath: URL.createObjectURL(file),
								image: file,
								makeChanges: true,
							},
						});
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

	const handleGroupCoverImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			dispatch({
				type: ACTION_TYPES.UPDATE_GROUP_COVER_IMAGE,
				payload: {
					imagePath: URL.createObjectURL(file),
					image: file,
					makeChanges: true,
				},
			});
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			if (state.groupName.trim() === "") {
				enqueueSnackbar("Please enter the group name", { variant: "warning" });
				document.querySelector("#group-name").focus();
				document.querySelector("#group-name").value = "";
				return;
			} else if (state.groupName.trim().length < 3) {
				enqueueSnackbar("Group name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#group-name").focus();
				document.querySelector("#group-name").value = document
					.querySelector("#group-name")
					.value.trim();
				return;
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();
			formdata.append("groupImage", state.groupImage);
			formdata.append("groupCoverImage", state.groupCoverImage);
			formdata.append("groupId", groupId);
			formdata.append("groupName", state.groupName);
			formdata.append("groupBio", state.groupBio);

			const res = await fetch(`${serverURL}/group/edit-group`, {
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

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Group updated", {
					variant: "success",
				});
				navigate(`/group/${groupId}`);
			} else if ("Fail to update group") {
				enqueueSnackbar("Fail to update group", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

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

	return user && token ? (
		<form className="page-layout-with-back-arrow" onSubmit={handleSave}>
			{state.loading && <Spinner />}
			{/* HEADER */}
			<DirectBackArrowHeader
				destination={`/group/${groupId}`}
				title="Edit group"
				discardChanges={state.makeChanges}
			/>
			<div className="mt-2">
				{/* GROUP IMAGE */}
				<div className="flex items-center justify-between mb-3">
					<h3>Group Image</h3>
					<EditText forInput="groupImageInput" />
					<input
						type="file"
						id="groupImageInput"
						accept="image/*"
						onChange={handleGroupImageChange}
						className="hidden"
					/>
				</div>
				<img
					src={state.groupImagePath}
					alt="Group image"
					className="rounded-full border border-blue-400 object-cover mx-auto h-40 w-40 md:h-56 md:w-56"
				/>
			</div>
			<hr className="my-5 border border-gray-300" />
			{/* GROUP COVER IMAGE */}
			<div className="flex items-center justify-between mb-2">
				<h3>Group Cover Image</h3>
				<EditText forInput="groupCoverImageInput" />
				<input
					type="file"
					id="groupCoverImageInput"
					accept="image/*"
					onChange={handleGroupCoverImageChange}
					className="hidden"
				/>
			</div>
			<img
				src={state.groupCoverImagePath}
				alt="Group cover image"
				className="rounded-xl w-full md:w-2/3 block mx-auto"
			/>
			<hr className="my-5 border border-gray-300" />
			<div className="grid grid-cols-9">
				{/* GROUP NAME */}
				<div className="md:col-span-4 col-span-9">
					<div className="flex items-center justify-between mb-3">
						<h3>Group Name</h3>
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
						id="group-name"
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
						value={state.groupName}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_GROUP_NAME,
								payload: e.target.value,
							});
							dispatch({ type: ACTION_TYPES.SET_MAKE_CHANGES, payload: true });
						}}
					/>
				</div>
				<hr className="md:hidden my-5 border border-gray-300 col-span-9" />
				{/* GROUP BIO */}
				<div className="md:col-start-6 md:col-span-4 col-span-9">
					<div className="flex items-center justify-between mb-3">
						<h3>Group Bio</h3>
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
						id="group-bio"
						maxLength={200}
						rows="4"
						className={`border ${
							state.isBioEdit
								? "border-gray-600 text-black"
								: "border-gray-300 text-gray-500"
						} py-1 px-2 rounded-xl w-full resize-none`}
						readOnly={!state.isBioEdit}
						disabled={!state.isBioEdit}
						value={state.groupBio}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_GROUP_BIO,
								payload: e.target.value,
							});
							dispatch({ type: ACTION_TYPES.SET_MAKE_CHANGES, payload: true });
						}}
					/>
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

export default EditGroupPage;
