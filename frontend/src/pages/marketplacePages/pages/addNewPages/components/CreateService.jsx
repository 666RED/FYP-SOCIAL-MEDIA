import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import RemoveImageText from "../../../../../components/RemoveImageText.jsx";
import UploadImage from "../../../../../components/UploadImage.jsx";
import RedStar from "../../../../../components/RedStar.jsx";
import ACTION_TYPES from "../actionTypes/createServiceActionTypes.js";

const CreateService = ({ state, dispatch }) => {
	const { user } = useSelector((store) => store.auth);

	const handleRemoveImage = () => {
		const ans = window.confirm("Remove service poster image?");
		if (ans) {
			dispatch({
				type: ACTION_TYPES.REMOVE_IMAGE,
			});
		}
	};

	// assign phone number
	useEffect(() => {
		dispatch({
			type: ACTION_TYPES.SET_CONTACT_NUMBER,
			payload: user.userPhoneNumber,
		});
	}, []);

	return (
		<div>
			{/* SERVICE NAME */}
			<h3 className="mt-3">
				Service name <RedStar />
			</h3>
			<input
				type="text"
				id="service-name"
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
			{/* SERVICE DESCRIPTION */}
			<h3 className="mt-3">
				Service description <RedStar />
			</h3>
			<input
				type="text"
				id="service-description"
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
			<h3 className="mt-3">
				Service category <RedStar />
			</h3>
			{/* SERVICE CATEGORY */}
			<div>
				{/* CATEGORY */}
				<select
					className="text-sm border-[1px] rounded-xl border-black p-3 my-1"
					onChange={(e) =>
						dispatch({
							type: ACTION_TYPES.SET_CATEGORY,
							payload: e.target.value,
						})
					}
					required
				>
					<option value="tutoring" selected>
						Tutoring
					</option>
					<option value="academic-writing-assistance">
						Academic writing assistance
					</option>
					<option value="graphic-design">Graphic design</option>
					<option value="photography-/-videography">
						Photography / Videography
					</option>
					<option value="it-support">IT support</option>
					<option value="language-translation">Language translation</option>
					<option value="event-planning">Event planning</option>
					<option value="car-hire">Car hire</option>
					<option value="food-delivery">Food delivery</option>
					<option value="other">Other</option>
				</select>
			</div>
			{/* SERVICE POSTER IMAGE */}
			<div className="flex justify-between items-center mt-3">
				<h3>
					Service poster image <RedStar />
				</h3>
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
			{/* CONTACT NUMBER */}
			<h3 className="mt-3">
				Contact number <RedStar />
			</h3>
			<input
				className="w-full my-1"
				type="text"
				required
				minLength={9}
				maxLength={11}
				value={state.contactNumber}
				placeholder="e.g. 0137829473"
				onChange={(e) => {
					const contactNumberReg = /^\d+$/;
					if (contactNumberReg.test(e.target.value) || e.target.value === "") {
						dispatch({
							type: ACTION_TYPES.SET_CONTACT_NUMBER,
							payload: e.target.value,
						});
					}
				}}
			/>
		</div>
	);
};

export default CreateService;
