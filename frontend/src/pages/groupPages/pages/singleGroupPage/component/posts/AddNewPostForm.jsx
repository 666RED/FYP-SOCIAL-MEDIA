import { React, useReducer, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import UploadImage from "../../../../../../components/UploadImage.jsx";
import UploadFile from "../../../../../../components/UploadFile.jsx";
import Filter from "../../../../../../components/Filter.jsx";
import FormHeader from "../../../../../../components/FormHeader.jsx";
import {
	addNewPostFormReducer,
	INITIAL_STATE,
} from "../../feature/addNewPostFormReducer.js";
import ACTION_TYPES from "../../actionTypes/addNewPostFormActionTypes.js";
import { useSnackbar } from "notistack";
import { ServerContext } from "../../../../../../App.js";
import { addNewPost } from "../../../../../../features/groupPostSlice.js";

const AddNewPostForm = ({ toggleShowAddNewPostForm }) => {
	const { enqueueSnackbar } = useSnackbar();
	const { groupId } = useParams();
	const sliceDispatch = useDispatch();
	const [state, dispatch] = useReducer(addNewPostFormReducer, INITIAL_STATE);
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.text.trim() === "") {
				enqueueSnackbar("Please enter post description", {
					variant: "warning",
				});
				document.getElementById("text-description").focus();
				document.getElementById("text-description").value = "";
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();

			formdata.append("groupId", groupId);
			formdata.append("userId", user._id);
			formdata.append("text", state.text.trim());
			formdata.append("image", state.image);
			formdata.append("file", state.file);

			const res = await fetch(`${serverURL}/group-post/add-new-group-post`, {
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

			const { msg, returnPost } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("New post added", {
					variant: "success",
				});
				toggleShowAddNewPostForm();
				sliceDispatch(addNewPost(returnPost));
			} else if (msg === "Fail to add new post") {
				enqueueSnackbar("Fail to add new post", {
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

	const handleRemove = () => {
		let ans;
		if (state.imagePath !== "") {
			ans = window.confirm("Remove image?");
		} else if (state.filePath !== "") {
			ans = window.confirm("Remove file?");
		}

		if (ans) {
			if (state.imagePath !== "") {
				dispatch({ type: ACTION_TYPES.REMOVE_IMAGE });
				document.getElementById("img-file").value = "";
			} else if (state.filePath !== "") {
				dispatch({ type: ACTION_TYPES.REMOVE_FILE });
				document.getElementById("note-file").value = "";
			}
		}
	};

	return (
		<div>
			{state.loading && <Spinner />}
			<Filter />
			<div className="z-40 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
				<form onSubmit={handleSubmit} className="form relative">
					{/* HEADER */}
					<FormHeader
						closeFunction={toggleShowAddNewPostForm}
						title="Add new post"
						discardChanges={state.makeChanges}
					/>
					{/* TEXT */}
					<label htmlFor="text-description">Text desription:</label>
					<textarea
						id="text-description"
						rows={6}
						value={state.text}
						onChange={(e) =>
							dispatch({ type: ACTION_TYPES.SET_TEXT, payload: e.target.value })
						}
						className="w-full resize-none my-1"
						required
					/>
					<div className="flex justify-between items-center">
						{/* MEDIA TYPES */}
						<div>
							<label>Media:</label>
							{/* IMAGE MEDIA TYPE */}
							<div className="inline-flex items-center">
								<input
									type="radio"
									name="media"
									id="image"
									className="ml-2 mr-1"
									checked={state.inputType === "image"}
									onClick={() => {
										dispatch({
											type: ACTION_TYPES.SET_INPUT_TYPE,
											payload: "image",
										});
										dispatch({ type: ACTION_TYPES.REMOVE_FILE });
									}}
								/>
								<label htmlFor="image">Image</label>
							</div>
							{/* FILE MEDIA TYPE */}
							<div className="inline-flex items-center">
								<input
									type="radio"
									name="media"
									id="file"
									checked={state.inputType === "file"}
									className="ml-2 mr-1"
									onClick={() => {
										dispatch({
											type: ACTION_TYPES.SET_INPUT_TYPE,
											payload: "file",
										});
										dispatch({ type: ACTION_TYPES.REMOVE_IMAGE });
									}}
								/>
								<label htmlFor="file">File</label>
							</div>
						</div>
						{/* REMOVE TEXT */}
						{(state.imagePath !== "" || state.filePath !== "") && (
							<p
								className="text-red-600 cursor-pointer hover:opacity-80"
								onClick={handleRemove}
							>
								Remove
							</p>
						)}
					</div>
					{/* IMAGE / FILE */}
					{state.inputType === "image" ? (
						<UploadImage
							dispatch={(payload) =>
								dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
							}
							imagePath={state.imagePath}
							bigImage={false}
						/>
					) : (
						<UploadFile
							dispatch={(payload) =>
								dispatch({ type: ACTION_TYPES.UPLOAD_FILE, payload })
							}
							filePath={state.filePath}
						/>
					)}
					{/* SUBMIT BUTTON */}
					<button className="btn-green block w-1/2 mx-auto mt-5">ADD</button>
				</form>
			</div>
		</div>
	);
};

export default AddNewPostForm;
