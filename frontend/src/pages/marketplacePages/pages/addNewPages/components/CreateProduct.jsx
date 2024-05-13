import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import RemoveImageText from "../../../../../components/RemoveImageText.jsx";
import UploadImage from "../../../../../components/UploadImage.jsx";
import ACTION_TYPES from "../actionTypes/createProductActionTypes.js";

const CreateProduct = ({ state, dispatch }) => {
	const { user } = useSelector((store) => store.auth);

	const handleRemoveImage = () => {
		const ans = window.confirm("Remove produt image?");
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
			{/* PRODUCT NAME */}
			<h3 className="mt-3">Product name:</h3>
			<input
				type="text"
				id="product-name"
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
			{/* PRODUCT DESCRIPTION */}
			<h3 className="mt-3">Product description:</h3>
			<input
				type="text"
				id="product-description"
				required
				className="w-full my-1"
				minLength={1}
				maxLength={200}
				value={state.description}
				onChange={(e) => {
					dispatch({
						type: ACTION_TYPES.SET_DESCRIPTION,
						payload: e.target.value,
					});
				}}
			/>
			{/* PRODUCT IMAGE */}
			<div className="flex justify-between items-center mt-3">
				<h3>Product image:</h3>
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
			{/* PRODUCT PRICE */}
			<h3 className="mt-3">Product price (RM):</h3>
			<input
				placeholder="RM"
				type="number"
				className="w-full my-1"
				required
				min={0.01}
				max={10000}
				step={0.01}
				value={state.price}
				onChange={(e) => {
					dispatch({ type: ACTION_TYPES.SET_PRICE, payload: e.target.value });
				}}
			/>
			{/* PRODUCT QUANTITY */}
			<h3 className="mt-3">Product quantity:</h3>
			<input
				type="number"
				className="w-full my-1"
				required
				min={1}
				max={1000}
				value={state.quantity}
				onChange={(e) => {
					dispatch({
						type: ACTION_TYPES.SET_QUANTITY,
						payload: e.target.value,
					});
				}}
			/>
			{/* CONTACT NUMBER */}
			<h3 className="mt-3">Contact number:</h3>
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

export default CreateProduct;
