import { React, useContext, useReducer, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Filter from "../../../../../../components/Filter.jsx";
import FormHeader from "../../../../../../components/FormHeader.jsx";
import UploadImage from "../../../../../../components/UploadImage.jsx";
import UploadFile from "../../../../../../components/UploadFile.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import {
	editPostFormReducer,
	INITIAL_STATE,
} from "../../feature/editPostFormReducer.js";
import ACTION_TYPES from "../../actionTypes/editPostFormActionTypes.js";
import { ServerContext } from "../../../../../../App.js";
import { updatePost } from "../../../../../../features/groupPostSlice.js";

const EditPostForm = ({
	toggleShowEditPostForm,
	toggleShowOptionDiv,
	post,
}) => {
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(editPostFormReducer, INITIAL_STATE);

	// first render
	useEffect(() => {
		dispatch({ type: ACTION_TYPES.FIRST_RENDER, payload: post });
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.postDescription.trim() === "") {
				enqueueSnackbar("Please enter post description", {
					variant: "warning",
				});
				document.getElementById("text-description").focus();
				document.getElementById("text-description").value = "";
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();

			formdata.append("postId", post._id);
			formdata.append("text", state.postDescription.trim());
			formdata.append("image", state.image);
			formdata.append("file", state.file);
			formdata.append("postImagePath", state.postImagePath);
			formdata.append("postFilePath", state.postFilePath);
			formdata.append("userId", user._id);

			const res = await fetch(`${serverURL}/group-post/edit-group-post`, {
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

			const { msg, returnGroupPost } = await res.json();

			if (msg === "Success") {
				toggleShowEditPostForm();
				toggleShowOptionDiv();

				sliceDispatch(updatePost(returnGroupPost));
				enqueueSnackbar("Post updated", {
					variant: "success",
				});
			} else if (
				msg === "Original post not found" ||
				msg === "Fail to update post" ||
				msg === "User not found"
			) {
				enqueueSnackbar("Fail to update post", {
					variant: "errro",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleRemove = () => {
		let ans;
		if (state.postImagePath !== "") {
			ans = window.confirm("Remove image?");
		} else if (state.postFilePath !== "") {
			ans = window.confirm("Remove file?");
		}

		if (ans) {
			if (state.postImagePath !== "") {
				dispatch({ type: ACTION_TYPES.REMOVE_IMAGE });
				document.getElementById("img-file").value = "";
			} else if (state.postFilePath !== "") {
				dispatch({ type: ACTION_TYPES.REMOVE_FILE });
				document.getElementById("note-file").value = "";
			}
		}
	};

	return (
		<div>
			{state.loading && <Spinner />}
			<Filter />
			<div className="center-container items-center">
				<form className="form" onSubmit={handleSubmit}>
					{/* HEADER */}
					<FormHeader
						closeFunction={toggleShowEditPostForm}
						title="Edit Post"
						discardChanges={
							state.hasPostDescriptionChanged ||
							state.hasImagePathChanged ||
							state.hasFilePathChanged
						}
					/>
					{/* TEXT */}
					<label htmlFor="text-description">Text description:</label>
					<textarea
						id="text-description"
						rows={6}
						maxLength={2000}
						className="w-full resize-none my-1"
						required
						value={state.postDescription}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_POST_DESCRIPTION,
								payload: e.target.value,
							});
							dispatch({
								type: ACTION_TYPES.SET_HAS_POST_DESCRIPTION_CHANGED,
								payload: true,
							});
						}}
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
										if (state.postFilePath !== "") {
											window.alert("Remove file before uploading image");
											return;
										}

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
										if (state.postImagePath !== "") {
											window.alert("Remove image before uploading file");
											return;
										}
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
						{(state.postImagePath !== "" || state.postFilePath !== "") && (
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
							imagePath={state.postImagePath === "" ? "" : state.postImagePath}
							bigImage={false}
						/>
					) : (
						<UploadFile
							dispatch={(payload) =>
								dispatch({ type: ACTION_TYPES.UPLOAD_FILE, payload })
							}
							filePath={state.postFilePath}
							originalName={post.postFileOriginalName}
							editFile={!state.hasFilePathChanged}
						/>
					)}
					{/* SUBMIT BUTTON */}
					<button className="btn-green block w-1/2 mx-auto mt-5">EDIT</button>
				</form>
			</div>
		</div>
	);
};

export default EditPostForm;
