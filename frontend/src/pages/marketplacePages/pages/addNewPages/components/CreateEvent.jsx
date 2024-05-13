import { React, useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import RemoveImageText from "../../../../../components/RemoveImageText.jsx";
import ContactNumberInputs from "./ContactNumberInputs.jsx";
import UploadImage from "../../../../../components/UploadImage.jsx";
import AddNewContactNumber from "./AddNewContactNumber.jsx";
import ACTION_TYPES from "../actionTypes/createEventActionTypes.js";
import { EventContext } from "../CreateNewItem.jsx";

const CreateEvent = () => {
	const { state, dispatch } = useContext(EventContext);
	const { user } = useSelector((store) => store.auth);

	const handleRemoveImage = () => {
		const ans = window.confirm("Remove event poster image?");
		if (ans) {
			dispatch({
				type: ACTION_TYPES.REMOVE_IMAGE,
			});
		}
	};

	// assign phone number
	useEffect(() => {
		dispatch({
			type: ACTION_TYPES.ADD_CONTACT_NUMBER,
			payload: { id: state.count, number: user.userPhoneNumber },
		});
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			dispatch({ type: ACTION_TYPES.RESET_STATE });
		};
	}, []);

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

	return (
		<div>
			{/* EVENT NAME */}
			<h3 className="mt-3">Event name:</h3>
			<input
				type="text"
				id="event-name"
				required
				className="w-full my-1"
				minLength={3}
				maxLength={50}
				value={state.name}
				onChange={(e) => {
					dispatch({
						type: ACTION_TYPES.SET_NAME,
						payload: e.target.value,
					});
				}}
			/>
			{/* EVENT DESCRIPTION */}
			<h3 className="mt-3">Event description:</h3>
			<input
				type="text"
				id="event-description"
				required
				className="w-full my-1"
				minLength={1}
				maxLength={50}
				value={state.description}
				onChange={(e) => {
					dispatch({
						type: ACTION_TYPES.SET_DESCRIPTION,
						payload: e.target.value,
					});
				}}
			/>
			{/* EVENT POSTER IMAGE */}
			<div className="flex justify-between items-center mt-3">
				<h3>Event poster image:</h3>
				<RemoveImageText
					handleRemove={handleRemoveImage}
					imagePath={state.imagePath}
				/>
			</div>
			<UploadImage
				dispatch={(payload) =>
					dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
				}
				imagePath={state.imagePath}
			/>
			{/* EVENT VENUE */}
			<h3 className="mt-3">Event venue:</h3>
			<input
				type="text"
				required
				id="event-venue"
				className="w-full my-1"
				minLength={1}
				maxLength={50}
				value={state.venue}
				onChange={(e) =>
					dispatch({ type: ACTION_TYPES.SET_VENUE, payload: e.target.value })
				}
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
				value={state.organizer}
				onChange={(e) =>
					dispatch({
						type: ACTION_TYPES.SET_ORGANIZER,
						payload: e.target.value,
					})
				}
			/>
			{/* EVENT CHECK BOX */}
			<div className="flex items-center mt-3">
				<input
					type="checkbox"
					id="one-day-checkbox"
					className="mr-1"
					onChange={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_IS_ONE_DAY_EVENT })
					}
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
							value={state.oneDate}
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
							className="w-full my-1"
							value={state.startTime}
							required
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
							value={state.endTime}
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
				// NOT ONE DAY EVENT
				<div className="my-1 grid grid-cols-6 gap-x-3">
					<div className="col-span-3">
						{/* START DATE */}
						<h3>Start date:</h3>
						<input
							type="date"
							className="w-full my-1"
							onChange={handleEndDate}
							value={state.startDate}
							required
						/>
					</div>
					<div className="col-span-3">
						{/* END DATE */}
						<h3>End date:</h3>
						<input
							required
							id="end-date"
							type="date"
							className={`w-full my-1 ${
								state.startDate === "" ? "text-gray-400" : "text-black"
							}`}
							disabled={state.startDate === ""}
							min={state.minEndDate}
							value={state.endDate}
							onChange={(e) =>
								dispatch({
									type: ACTION_TYPES.SET_END_DATE,
									payload: e.target.value,
								})
							}
						/>
					</div>
				</div>
			)}
			{/* CONTACT NUMBER */}
			<h3 className="mt-3">Contact number:</h3>
			<ContactNumberInputs />
			<AddNewContactNumber />
		</div>
	);
};

export default CreateEvent;
