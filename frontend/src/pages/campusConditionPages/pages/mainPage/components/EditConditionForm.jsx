import { React, useContext, useReducer, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Filter from "../../../../../components/Filter.jsx";
import FormHeader from "../../../../../components/FormHeader.jsx";
import UploadImage from "../../../../../components/UploadImage.jsx";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import RemoveImageText from "../../../../../components/RemoveImageText.jsx";
import Places from "../../uploadPage/components/Places.jsx";
import RedStar from "../../../../../components/RedStar.jsx";
import {
	editConditionFormReducer,
	INITIAL_STATE,
} from "../features/editConditionFormReducer.js";
import ACTION_TYPES from "../actionTypes/editConditionFormActionTypes.js";
import { ServerContext } from "../../../../../App.js";
import {
	loadCurrentLocation,
	setHasConditionLocationChanged,
} from "../../../features/campusConditionSlice.js";

const EditConditionForm = ({
	toggleShowOptionDiv,
	toggleShowEditConditionForm,
	condition,
	inViewMostUseful,
	updateCampusCondition,
	updateMostUsefulCondition = null,
}) => {
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const [state, dispatch] = useReducer(editConditionFormReducer, INITIAL_STATE);
	const sliceDispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.auth);
	const { center, hasConditionLocationChanged } = useSelector(
		(store) => store.campusCondition
	);

	// FIRST RENDER
	useEffect(() => {
		const {
			conditionTitle,
			conditionDescription,
			conditionImagePath,
			conditionLocation,
		} = condition;
		dispatch({
			type: ACTION_TYPES.FIRST_RENDER,
			payload: {
				conditionTitle,
				conditionDescription,
				conditionImagePath,
				conditionLocation,
			},
		});

		const { locationLatitude, locationLongitude } = condition.conditionLocation;

		sliceDispatch(
			loadCurrentLocation({
				location: {
					lat: parseFloat(locationLatitude),
					lng: parseFloat(locationLongitude),
				},
			})
		);

		return () => {
			sliceDispatch(setHasConditionLocationChanged(false));
		};
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (state.conditionTitle.trim() === "") {
				enqueueSnackbar("Please enter condition title", {
					variant: "warning",
				});
				document.querySelector("#condition-title").focus();
				document.querySelector("#condition-title").value = "";
				return;
			} else if (state.conditionDescription.trim() === "") {
				enqueueSnackbar("Please enter condition description", {
					variant: "warning",
				});
				document.querySelector("#condition-description").focus();
				document.querySelector("#condition-description").value = "";
				return;
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();
			formdata.append("campusConditionId", condition._id);
			formdata.append("conditionTitle", state.conditionTitle.trim());
			formdata.append(
				"conditionDescription",
				state.conditionDescription.trim()
			);
			formdata.append("conditionImage", state.conditionImage);
			formdata.append("conditionImagePath", state.conditionImagePath);
			formdata.append("locationLatitude", center.lat);
			formdata.append("locationLongitude", center.lng);

			const res = await fetch(`${serverURL}/campus-condition/edit-condition`, {
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

			const { msg, returnCondition } = await res.json();

			if (msg === "Success") {
				sliceDispatch(updateCampusCondition(returnCondition));
				if (updateMostUsefulCondition !== null) {
					sliceDispatch(updateMostUsefulCondition(returnCondition));
				}
				toggleShowOptionDiv();
				toggleShowEditConditionForm();
				enqueueSnackbar("Condition updated", {
					variant: "success",
				});
				if (inViewMostUseful) {
					navigate("/campus-condition");
				}
			} else if (msg === "Fail to edit condition") {
				enqueueSnackbar("Fail to edit condition", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			console.log(err);

			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleRemove = () => {
		const ans = window.confirm("Remove condition image?");
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
			<div className="center-container items-center py-4">
				<form
					className="form max-h-full overflow-y-auto w-5/6"
					onSubmit={handleSubmit}
				>
					{/* HEADER */}
					<FormHeader
						title="Edit Condition"
						discardChanges={
							state.hasConditionTitleChanged ||
							state.hasConditionDescriptionChanged ||
							state.hasConditionImagePathChanged ||
							hasConditionLocationChanged
						}
						closeFunction={toggleShowEditConditionForm}
					/>

					{/* TITLE */}
					<label htmlFor="condition-title">
						Condition title <RedStar />
					</label>
					<input
						type="text"
						id="condition-title"
						value={state.conditionTitle}
						onChange={(e) =>
							dispatch({
								type: ACTION_TYPES.SET_CONDITION_TITLE,
								payload: e.target.value,
							})
						}
						className="w-full mt-1 mb-2"
						required
						maxLength={50}
					/>

					{/* DESCRIPTION */}
					<label htmlFor="condition-description">
						Condition description <RedStar />
					</label>
					<textarea
						type="text"
						id="condition-description"
						value={state.conditionDescription}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_CONDITION_DESCRIPTION,
								payload: e.target.value,
							});
						}}
						className="w-full resize-none mt-1 mb-2"
						rows={6}
						maxLength={200}
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
							state.conditionImagePath === "" ? "" : state.conditionImagePath // added new condition image
						}
						dispatch={(payload) =>
							dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
						}
					/>

					{/* LOCATION */}
					<p className="mt-4">
						Location <RedStar />
					</p>
					<Places />

					{/* SUBMIT BUTTON */}
					<button className="btn-green block w-1/2 md:w-1/4 mx-auto mt-7">
						EDIT
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditConditionForm;
