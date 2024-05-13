import { React, useEffect, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdDeleteForever } from "react-icons/md";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import UploadImage from "../../../../../../components/UploadImage.jsx";
import Error from "../../../../../../components/Error.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import ContactNumberInputs from "./ContactNumberInputs.jsx";
import AddNewContactNumber from "./AddNewContactNumber.jsx";
import { editEventReducer, INITIAL_STATE } from "./feature/editEventReducer.js";
import ACTION_TYPES from "./actionTypes/editEventActionTypes.js";
import { ServerContext } from "../../../../../../App.js";

const EditEvent = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(editEventReducer, INITIAL_STATE);

	const eventPosterImagePath = `${serverURL}/public/images/event/`;

	// first render
	useEffect(() => {
		const getEvent = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/event/get-event?id=${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok && res.status === 403) {
					dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, event } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.FIRST_RENDER,
						payload: event,
					});
				} else if (msg === "Event not found") {
					enqueueSnackbar("Event not found", {
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
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		};

		getEvent();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.eventName.trim() === "") {
				enqueueSnackbar("Please enter event name", {
					variant: "warning",
				});
				document.querySelector("#event-name").value = "";
				document.querySelector("#event-name").focus();
				return;
			} else if (state.eventName.trim().length < 3) {
				enqueueSnackbar("Event name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#event-name").value = "";
				document.querySelector("#event-name").focus();
				return;
			} else if (state.eventDescription.trim() === "") {
				enqueueSnackbar("Please enter event description", {
					variant: "warning",
				});
				document.querySelector("#event-description").value = "";
				document.querySelector("#event-description").focus();
				return;
			} else if (state.eventVenue.trim() === "") {
				enqueueSnackbar("Please enter event venue", {
					variant: "warning",
				});
				document.querySelector("#event-venue").value = "";
				document.querySelector("#event-venue").focus();
				return;
			} else if (state.eventOrganizer.trim() === "") {
				enqueueSnackbar("Please enter event organizer", {
					variant: "warning",
				});
				document.querySelector("#event-organizer").value = "";
				document.querySelector("#event-organizer").focus();
				return;
			} else if (state.eventPosterImagePath === "") {
				enqueueSnackbar("Please upload an event poster image", {
					variant: "warning",
				});
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const contactNumberArr = state.contactNumbers.map((num) => num.number);

			const formdata = new FormData();
			formdata.append("eventId", id);
			formdata.append("name", state.eventName.trim());
			formdata.append("description", state.eventDescription.trim());
			formdata.append("venue", state.eventVenue.trim());
			formdata.append("contactNumbers", JSON.stringify(contactNumberArr));
			formdata.append("image", state.image);
			formdata.append("isOneDayEvent", state.isOneDayEvent);
			formdata.append("organizer", state.eventOrganizer.trim());

			if (state.isOneDayEvent) {
				formdata.append("oneDate", state.eventOneDate);
				formdata.append("startTime", state.eventStartTime);
				formdata.append("endTime", state.eventEndTime);
			} else {
				formdata.append("startDate", state.eventStartDate);
				formdata.append("endDate", state.eventEndDate);
			}

			const res = await fetch(`${serverURL}/event/edit-event`, {
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

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Event edited", { variant: "success" });
				navigate("/marketplace");
			} else if (msg === "Fail to edit event") {
				enqueueSnackbar("Fail to edit event", { variant: "error" });
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

	const handleRemove = async () => {
		try {
			const ans = window.confirm("Remove event?");

			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/event/remove-event`, {
					method: "PATCH",
					body: JSON.stringify({ eventId: id }),
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

				const { msg } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Event removed", {
						variant: "success",
					});
					navigate("/marketplace");
				} else if (msg === "Fail to remove event") {
					enqueueSnackbar("Fail to remove event", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	const handleEndDate = (e) => {
		dispatch({ type: ACTION_TYPES.SET_START_DATE, payload: e.target.value });
		dispatch({ type: ACTION_TYPES.SET_END_DATE, payload: "" });
		const myDate = new Date(e.target.value);

		const year = myDate.getFullYear();
		const month = String(myDate.getMonth() + 1).padStart(2, "0");
		const date = String(myDate.getDate() + 1).padStart(2, "0");

		const minDate = `${year}-${month}-${date}`;

		dispatch({ type: ACTION_TYPES.SET_MIN_END_DATE, payload: minDate });
	};

	return user && token ? (
		<div className="page-layout-with-back-arrow mb-5 relative">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination="/marketplace"
				title="Edit Event"
				discardChanges={state.madeChanges || state.hasIamgePathChanged}
			/>
			{state.loading && <Spinner />}
			{/* FORM CONTAINER */}
			<form
				className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3"
				onSubmit={handleSubmit}
			>
				{/* EVENT POSTER IMAGE */}
				<h3>Event poster image:</h3>
				<UploadImage
					dispatch={(payload) =>
						dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
					}
					imagePath={
						state.hasImagePathChanged
							? state.eventPosterImagePath
							: `${eventPosterImagePath}${state.eventPosterImagePath}`
					}
				/>
				{/* EVENT NAME */}
				<h3 className="mt-3">Event name:</h3>
				<input
					type="text"
					id="event-name"
					required
					className="w-full my-1"
					minLength={3}
					maxLength={50}
					value={state.eventName}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_NAME,
							payload: e.target.value,
						});
					}}
				/>
				{/* EVENT DESCRIPTION */}
				<h3 className="mt-3">Event description:</h3>
				<textarea
					id="event-description"
					required
					rows="5"
					className="resize-none my-1 w-full"
					value={state.eventDescription}
					minLength={1}
					maxLength={200}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_DESCRIPTION,
							payload: e.target.value,
						});
					}}
				/>
				{/* EVENT VENUE */}
				<h3 className="mt-3">Event venue:</h3>
				<input
					type="text"
					id="event-venue"
					required
					className="w-full my-1"
					minLength={3}
					maxLength={50}
					value={state.eventVenue}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_VENUE,
							payload: e.target.value,
						});
					}}
				/>
				{/* EVENT ORGANIZER */}
				<h3 className="mt-3">Event organizer:</h3>
				<input
					type="text"
					required
					id="event-organizer"
					className="w-full my-1"
					minLength={1}
					maxLength={50}
					value={state.eventOrganizer}
					onChange={(e) =>
						dispatch({
							type: ACTION_TYPES.SET_ORGANIZER,
							payload: e.target.value,
						})
					}
				/>
				{/* EVENT CHECK BOX */}
				<div className="flex-items-center mt-3">
					<input
						type="checkbox"
						id="one-day-checkbox"
						className="mr-1"
						onChange={() =>
							dispatch({ type: ACTION_TYPES.TOGGLE_IS_ONE_DAY_EVENT })
						}
						checked={state.isOneDayEvent}
					/>
					<label htmlFor="one-day-checkbox">One day event</label>
				</div>
				{/* EVENT DAY & TIME */}
				{state.isOneDayEvent ? (
					// ONE DAY EVENT
					<div className="my-1 grid grid-cols-6 gap-x-3">
						{/* ONE DATE */}
						<div className="col-span-6 md:col-span-2">
							<h3>Date:</h3>
							<input
								type="date"
								className="w-full my-1"
								min={new Date().toISOString().slice(0, 10)}
								value={state.eventOneDate}
								required
								onChange={(e) =>
									dispatch({
										type: ACTION_TYPES.SET_ONE_DATE,
										payload: e.target.value,
									})
								}
							/>
						</div>
						{/* START TIME */}
						<div className="col-span-3 md:col-span-2">
							<h3>Start time:</h3>
							<input
								type="time"
								required
								className="w-full my-1"
								value={state.eventStartTime}
								onChange={(e) =>
									dispatch({
										type: ACTION_TYPES.SET_START_TIME,
										payload: e.target.value,
									})
								}
							/>
						</div>
						{/* END TIME */}
						<div className="col-span-3 md:col-span-2">
							<h3>End time:</h3>
							<input
								required
								type="time"
								className="w-full my-1"
								value={state.eventEndTime}
								onChange={(e) =>
									dispatch({
										type: ACTION_TYPES.SET_END_TIME,
										payload: e.target.value,
									})
								}
							/>
						</div>
					</div>
				) : (
					// MULTIPLE DAYS EVENT
					<div className="my-1 grid grid-cols-6 gap-x-3">
						<div className="col-span-3">
							{/* START DATE */}
							<h3>Start date:</h3>
							<input
								type="date"
								className="w-full my-1"
								value={state.eventStartDate}
								required
								onChange={handleEndDate}
							/>
						</div>
						<div className="col-span-3">
							{/* END DATE */}
							<h3>End date:</h3>
							<input
								type="date"
								id="end-date"
								required
								className={`w-full my-1 ${
									state.eventStartDate === "" ? "text-gray-400" : "text-black"
								}`}
								min={state.minEndDate}
								value={state.eventEndDate}
								onChange={(e) => {
									dispatch({
										type: ACTION_TYPES.SET_END_DATE,
										payload: e.target.value,
									});
								}}
							/>
						</div>
					</div>
				)}
				{/* CONTACT NUMBERS */}
				<h3 className="mt-3">Contact number:</h3>
				<ContactNumberInputs state={state} dispatch={dispatch} />
				<AddNewContactNumber state={state} dispatch={dispatch} />
				{/* EDIT BUTTON */}
				<button className="btn-green mt-8 block mx-auto w-1/2 md:w-1/4 mb-5">
					EDIT
				</button>
			</form>
			{/* REMOVE ICON */}
			<MdDeleteForever
				className="text-3xl cursor-pointer hover:opacity-80 text-red-600 absolute top-1 right-1"
				onClick={handleRemove}
			/>
		</div>
	) : (
		<Error />
	);
};

export default EditEvent;
