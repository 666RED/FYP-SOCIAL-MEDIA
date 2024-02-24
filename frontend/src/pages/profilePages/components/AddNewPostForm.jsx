import { React, useEffect, useReducer, useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner.jsx";
import UploadImage from "../../../components/UploadImage.jsx";
import Filter from "../../../components/Filter.jsx";
import FormHeader from "../../../components/FormHeader.jsx";
import { useSnackbar } from "notistack";
import {
	setShowAddNewPostForm,
	setPostAdded,
} from "../features/userProfilePageSlice.js";
import {
	addNewPostFormReducer,
	INITIAL_STATE,
} from "../features/addNewPostFormReducer.js";
import { ACTION_TYPES } from "../actionTypes/addNewPostFormActionTypes.js";
import { ServerContext } from "../../../App.js";
export const MyContext = createContext(null); // pass state to child component

const AddNewPostForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const sliceDispatch = useDispatch();
	const [state, dispatch] = useReducer(addNewPostFormReducer, INITIAL_STATE);
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const formdata = new FormData();
			formdata.append("text", state.text);
			formdata.append("image", state.image);
			formdata.append("userId", user._id);

			const res = await fetch(`${serverURL}/post/add-new-post`, {
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${token}`,
				},
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

			const { msg, savedPost } = await res.json();
			if (msg == "Success") {
				enqueueSnackbar("New post added", {
					variant: "success",
				});
				sliceDispatch(setShowAddNewPostForm(false));
				sliceDispatch(setPostAdded(true));
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	return (
		<div>
			{state.loading && <Spinner />}
			<Filter />
			<div className="z-40 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
				<form onSubmit={handleSubmit} className="form relatvie">
					<FormHeader
						title="Add new post"
						closeFunction={() => sliceDispatch(setShowAddNewPostForm(false))}
						discardChanges={state.madeChange}
					/>
					{/* TEXT */}
					<label htmlFor="text-description">Text description:</label>
					<textarea
						type="text"
						id="text-description"
						value={state.text}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_TEXT,
								payload: e.target.value,
							});
							dispatch({ type: ACTION_TYPES.MADE_CHANGE, payload: true });
						}}
						className="w-full resize-none my-1"
						rows={6}
						maxLength={2000}
					/>
					{/* IMAGE */}
					<label>Image:</label>
					<MyContext.Provider value={{ state, dispatch }}>
						<UploadImage />
					</MyContext.Provider>

					{/* SUBMIT BUTTON */}
					<button className="btn-green block w-1/2 mx-auto mt-5">ADD</button>
				</form>
			</div>
		</div>
	);
};

export default AddNewPostForm;
