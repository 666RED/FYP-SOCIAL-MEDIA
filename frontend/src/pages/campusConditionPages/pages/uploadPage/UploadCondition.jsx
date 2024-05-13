import { React, useReducer, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import RemoveImageText from "../../../../components/RemoveImageText.jsx";
import UploadImage from "../../../../components/UploadImage.jsx";
import Places from "./components/Places.jsx";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import Error from "../../../../components/Error.jsx";
import {
	uploadConditionReducer,
	INITIAL_STATE,
} from "./features/uploadConditionReducer.js";
import ACTION_TYPES from "../uploadPage/actionTypes/uploadConditionActionTypes.js";
import { loadCurrentLocation } from "../../features/campusConditionSlice.js";
import { ServerContext } from "../../../../App.js";

const UploadCondition = () => {
	const sliceDispatch = useDispatch();
	const [state, dispatch] = useReducer(uploadConditionReducer, INITIAL_STATE);
	const { user, token } = useSelector((store) => store.auth);
	const { center } = useSelector((store) => store.campusCondition);
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();

	// get current location
	useEffect(() => {
		const getCurrentLocation = () => {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					sliceDispatch(
						loadCurrentLocation({
							location: {
								lat: parseFloat(latitude),
								lng: parseFloat(longitude),
							},
						})
					);
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		};
		getCurrentLocation();
	}, []);

	const handleRemove = () => {
		const ans = window.confirm("Remove image?");
		if (ans) {
			dispatch({
				type: ACTION_TYPES.REMOVE_IMAGE,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.title.trim() === "") {
				enqueueSnackbar("Please enter condition title", {
					variant: "warning",
				});
				document.querySelector("#title").focus();
				document.querySelector("#title").value = "";
				return;
			} else if (state.description.trim() === "") {
				enqueueSnackbar("Please enter condition description", {
					variant: "warning",
				});
				document.querySelector("#description").focus();
				document.querySelector("#description").value = "";
				return;
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const formdata = new FormData();
			formdata.append("title", state.title.trim());
			formdata.append("description", state.description.trim());
			formdata.append("image", state.postImage);
			formdata.append("latitude", center.lat);
			formdata.append("longitude", center.lng);
			formdata.append("userId", user._id);

			const res = await fetch(
				`${serverURL}/campus-condition/add-new-campus-condition`,
				{
					method: "POST",
					body: formdata,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, savedCampusCondition } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Campus condition uploaded", {
					variant: "success",
				});
				navigate("/campus-condition");
			} else if (msg === "Fail to upload new condition") {
				enqueueSnackbar("Fail to upload new condition", {
					variant: "success",
				});
			} else {
				enqueueSnackbar("An error occurred", {
					variant: "success",
				});
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		}
	};

	return user && token ? (
		<form className="page-layout-with-back-arrow" onSubmit={handleSubmit}>
			{state.loading && <Spinner />}
			{/* HEADER */}
			<DirectBackArrowHeader
				destination="/campus-condition"
				title="Upload Condition"
			/>
			{/* MAIN CONTENT CONTAINER */}
			<div className="md:w-2/3 mx-auto">
				{/* TITLE */}
				<h3 className="mt-3">Title:</h3>
				<input
					id="title"
					type="text"
					required
					className="w-full my-1"
					maxLength={50}
					value={state.title}
					onChange={(e) =>
						dispatch({ type: ACTION_TYPES.SET_TITLE, payload: e.target.value })
					}
				/>
				{/* DESCRIPTION */}
				<h3 className="mt-3">Description:</h3>
				<textarea
					id="description"
					rows="5"
					className="w-full my-1 resize-none"
					required
					maxLength={200}
					value={state.description}
					onChange={(e) =>
						dispatch({
							type: ACTION_TYPES.SET_DESCRIPTION,
							payload: e.target.value,
						})
					}
				></textarea>
				{/* IMAGE */}
				<div className="flex justify-between items-center mt-3">
					<h3>Image:</h3>
					<RemoveImageText
						handleRemove={handleRemove}
						imagePath={state.postImagePath}
					/>
				</div>
				<UploadImage
					dispatch={(payload) =>
						dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
					}
					imagePath={state.postImagePath}
				/>
				{/* LOCATION */}
				<h3 className="mt-3">Location:</h3>
				{/*  MAP */}
				<Places />
				<button className="btn-green my-6 w-1/3 md:w-1/4 block mx-auto">
					UPLOAD
				</button>
			</div>
		</form>
	) : (
		<Error />
	);
};

export default UploadCondition;
