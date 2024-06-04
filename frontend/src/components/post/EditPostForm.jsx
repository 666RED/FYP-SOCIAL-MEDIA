import { React, useContext, useReducer, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Filter from "../Filter.jsx";
import FormHeader from "../FormHeader.jsx";
import UploadImage from "../UploadImage.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import RemoveImageText from "../RemoveImageText.jsx";
import {
	editPostFormReducer,
	INITIAL_STATE,
} from "./feature/editPostFormReducer.js";
import ACTION_TYPES from "./actionTypes/editPostFormActionTypes.js";
import { ServerContext } from "../../App.js";

const EditPostForm = ({
	toggleShowEditPostForm,
	toggleShowOptionDiv,
	post,
	updatePost,
}) => {
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const postImgPath = `${serverURL}/public/images/post/`;
	const [state, dispatch] = useReducer(editPostFormReducer, INITIAL_STATE);
	const { token } = useSelector((store) => store.auth);

	// First render
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
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const formdata = new FormData();
			formdata.append("postDescription", state.postDescription.trim());
			formdata.append("postImage", state.image);
			formdata.append("postImagePath", state.postImagePath);
			formdata.append("postId", post._id);
			formdata.append("userId", post.userId);

			const res = await fetch(`${serverURL}/post/edit-post`, {
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, updatedPost } = await res.json();

			if (msg === "Success") {
				sliceDispatch(updatePost(updatedPost));
				enqueueSnackbar("Post updated", {
					variant: "success",
				});
				toggleShowEditPostForm();
				toggleShowOptionDiv();
			} else if (msg === "Fail to update post") {
				enqueueSnackbar("Fail to edit post", {
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
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleRemove = () => {
		const ans = window.confirm("Remove post image?");
		if (ans) {
			dispatch({
				type: ACTION_TYPES.REMOVE_IMAGE,
			});
		}
	};

	return (
		<div>
			{state.loading && <Spinner />}
			<Filter />
			<div className="center-container">
				<form className="form" onSubmit={handleSubmit}>
					{/* HEADER */}
					<FormHeader
						title="Edit Post"
						discardChanges={
							state.hasPostDescriptionChanged || state.hasImagePathChanged
						}
						closeFunction={toggleShowEditPostForm}
					/>
					{/* TEXT */}
					<label htmlFor="text-description">Text description:</label>
					<textarea
						id="text-description"
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
						className="w-full resize-none my-1"
						rows={6}
						maxLength={2000}
						required
					/>
					{/* IMAGE */}
					<div className="flex items-center justify-between">
						<label>Image:</label>
						{/* REMOVE IMAGE TEXT */}
						<RemoveImageText
							imagePath={state.postImagePath}
							handleRemove={handleRemove}
						/>
					</div>
					<UploadImage
						imagePath={
							state.postImagePath === ""
								? ""
								: // added new post image
								state.hasImagePathChanged
								? state.postImagePath // new image path
								: `${postImgPath}${state.postImagePath}` // original image path
						}
						dispatch={(payload) =>
							dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
						}
						bigImage={false}
					/>
					{/* SUBMIT BUTTON */}
					<button className="btn-green block w-1/2 mx-auto mt-5">EDIT</button>
				</form>
			</div>
		</div>
	);
};

export default EditPostForm;
