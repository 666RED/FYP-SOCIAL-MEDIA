import { React, useContext, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import Error from "../../../../components/Error.jsx";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import RedStar from "../../../../components/RedStar.jsx";
import RemoveImageText from "../../../../components/RemoveImageText.jsx";
import UploadCircleImage from "../../../../components/UploadCircleImage.jsx";
import UploadImage from "../../../../components/UploadImage.jsx";
import {
	createNewGroupPageReducer,
	INITIAL_STATE,
} from "./feature/createNewGroupPageReducer.js";
import ACTION_TYPES from "./actionTypes/createNewGroupPageActionTypes.js";
import { ServerContext } from "../../../../App.js";

const CreateNewGroupPage = () => {
	const [state, dispatch] = useReducer(
		createNewGroupPageReducer,
		INITIAL_STATE
	);
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.name.trim() === "") {
				enqueueSnackbar("Please enter group name", {
					variant: "warning",
				});
				document.querySelector("#name").value = "";
				document.querySelector("#name").focus();
				return;
			} else if (state.name.trim().length < 3) {
				enqueueSnackbar("Group name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#name").value = document
					.querySelector("#name")
					.value.trim();
				document.querySelector("#name").focus();
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();
			formdata.append("name", state.name.trim());
			formdata.append("bio", state.bio.trim());
			formdata.append("groupImage", state.groupImage);
			formdata.append("groupCoverImage", state.groupCoverImage);
			formdata.append("userId", user._id);

			const res = await fetch(`${serverURL}/group/create-new-group`, {
				method: "POST",
				body: formdata,
				headers: {
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

			const { msg, savedGroup } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("New group created", {
					variant: "success",
				});
				navigate(`/group/${savedGroup._id}`);
			} else if (msg === "Fail to create new group") {
				enqueueSnackbar("Fail to create new group", {
					variant: "error",
				});
			} else if (msg === "Fail to update user") {
				enqueueSnackbar("Fail to update user", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({
				type: ACTION_TYPES.SET_LOADING,
				payload: false,
			});
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

	const handleRemoveImage = () => {
		const ans = window.confirm("Remove group image?");
		if (ans) {
			dispatch({
				type: ACTION_TYPES.REMOVE_IMAGE,
			});
		}
	};

	const handleRemoveCoverImage = () => {
		const ans = window.confirm("Remove group cover image?");
		if (ans) {
			dispatch({
				type: ACTION_TYPES.REMOVE_COVER_IMAGE,
			});
		}
	};

	return user && token ? (
		<form
			onSubmit={handleSubmit}
			className="page-layout-with-back-arrow pb-3"
			autoComplete="off"
		>
			{state.loading && <Spinner />}
			{/* HEADER */}
			<DirectBackArrowHeader
				destination="/group"
				title="Create new group"
				discardChanges={state.madeChanges}
			/>
			{/* MAIN CONTENT CONTAINER */}
			<div className="md:w-2/3 mx-auto">
				{/* NAME */}
				<h3 className="mt-3">
					Name <RedStar />
				</h3>
				<input
					id="name"
					type="text"
					required
					className="w-full my-1"
					minLength={3}
					maxLength={50}
					value={state.name}
					onChange={(e) =>
						dispatch({ type: ACTION_TYPES.SET_NAME, payload: e.target.value })
					}
				/>
				{/* GROUP IMAGE */}
				<div className="flex justify-between items-center mt-3">
					<h3>Image:</h3>
					<RemoveImageText
						handleRemove={handleRemoveImage}
						imagePath={state.groupImagePath}
					/>
				</div>
				<UploadCircleImage
					dispatch={(payload) =>
						dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
					}
					imagePath={state.groupImagePath}
				/>
				{/* GROUP COVER IMAGE */}
				<div className="flex justify-between items-center mt-3">
					<h3>Group Cover Image:</h3>
					<RemoveImageText
						handleRemove={handleRemoveCoverImage}
						imagePath={state.groupCoverImagePath}
					/>
				</div>
				<UploadImage
					dispatch={(payload) =>
						dispatch({ type: ACTION_TYPES.UPLOAD_COVER_IMAGE, payload })
					}
					imagePath={state.groupCoverImagePath}
				/>
				{/* BIO */}
				<h3>
					Bio <RedStar />
				</h3>
				<textarea
					required
					id="bio"
					className="w-full my-1 resize-none"
					maxLength={200}
					rows="4"
					value={state.bio}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_BIO,
							payload: e.target.value,
						});
					}}
				/>
				{/* CREATE BUTTON */}
				<button className="btn-green mt-8 block mx-auto w-1/2 md:w-1/4">
					CREATE
				</button>
			</div>
		</form>
	) : (
		<Error />
	);
};

export default CreateNewGroupPage;
