import { React, useEffect, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import UploadImage from "../../../../../../components/UploadImage.jsx";
import Error from "../../../../../../components/Error.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import { MdDeleteForever } from "react-icons/md";
import {
	editProductReducer,
	INITIAL_STATE,
} from "./feature/editProductReducer.js";
import ACTION_TYPES from "./actionTypes/editProductActionTypes.js";
import { ServerContext } from "../../../../../../App.js";

const EditProduct = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(editProductReducer, INITIAL_STATE);

	const productImagePath = `${serverURL}/public/images/product/`;

	// first render
	useEffect(() => {
		const getProduct = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/product/get-product?id=${id}`, {
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

				const { msg, product } = await res.json();

				if (msg === "Success") {
					dispatch({ type: ACTION_TYPES.FIRST_RENDER, payload: product });
				} else if (msg === "Product not found") {
					enqueueSnackbar("Product not found", {
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

		getProduct();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.productName.trim() === "") {
				enqueueSnackbar("Please enter product name", {
					variant: "warning",
				});
				document.querySelector("#product-name").value = "";
				document.querySelector("#product-name").focus();
				return;
			} else if (state.productName.trim().length < 3) {
				enqueueSnackbar("Product name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#product-name").value = "";
				document.querySelector("#product-name").focus();
				return;
			} else if (state.productDescription.trim() === "") {
				enqueueSnackbar("Please enter product description", {
					variant: "warning",
				});
				document.querySelector("#product-description").value = "";
				document.querySelector("#product-description").focus();
				return;
			} else if (state.productImagePath === "") {
				enqueueSnackbar("Please upload a product image", {
					variant: "warning",
				});
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();
			formdata.append("productId", id);
			formdata.append("name", state.productName.trim());
			formdata.append("description", state.productDescription.trim());
			formdata.append("image", state.image);
			formdata.append("price", state.productPrice);
			formdata.append("quantity", state.productQuantity);
			formdata.append("contactNumber", state.contactNumber);

			const res = await fetch(`${serverURL}/product/edit-product`, {
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
				enqueueSnackbar("Product edited", { variant: "success" });
				navigate("/marketplace");
			} else if (msg === "Fail to edit product") {
				enqueueSnackbar("Fail to edit product", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	const handleRemove = async () => {
		try {
			const ans = window.confirm("Remove product?");
			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/product/remove-product`, {
					method: "PATCH",
					body: JSON.stringify({ productId: id }),
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
					enqueueSnackbar("Product removed", {
						variant: "success",
					});
					navigate("/marketplace");
				} else if (msg === "Fail to remove product") {
					enqueueSnackbar("Fail to remove product", {
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

	return user && token ? (
		<div className="page-layout-with-back-arrow mb-5 relative">
			{/* HEADER */}
			<DirectBackArrowHeader destination="/marketplace" title="Edit Product" />
			{state.loading && <Spinner />}

			{/* FORM CONTAINER */}
			<form
				className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3"
				onSubmit={handleSubmit}
			>
				{/* PRODUCT IMAGE */}
				<h3>Product image:</h3>
				<UploadImage
					dispatch={(payload) =>
						dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
					}
					imagePath={
						state.hasImagePathChanged
							? state.productImagePath
							: `${productImagePath}${state.productImagePath}`
					}
				/>
				{/* PRODUCT NAME */}
				<h3 className="mt-3">Product name:</h3>
				<input
					type="text"
					id="product-name"
					required
					className="w-full my-1"
					minLength={3}
					maxLength={50}
					value={state.productName}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_PRODUCT_NAME,
							payload: e.target.value,
						});
					}}
				/>
				{/* PRODUCT DESCRIPTION */}
				<h3 className="mt-3">Product description:</h3>
				<textarea
					required
					rows="5"
					className="resize-none my-1 w-full"
					value={state.productDescription}
					minLength={1}
					maxLength={200}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_PRODUCT_DESCRIPTION,
							payload: e.target.value,
						});
					}}
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
					value={state.productPrice}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_PRODUCT_PRICE,
							payload: e.target.value,
						});
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
					value={state.productQuantity}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_PRODUCT_QUANTITY,
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
						if (
							contactNumberReg.test(e.target.value) ||
							e.target.value === ""
						) {
							dispatch({
								type: ACTION_TYPES.SET_CONTACT_NUMBER,
								payload: e.target.value,
							});
						}
					}}
				/>
				{/* EDIT BUTTON */}
				<button className="btn-green mx-auto block mt-3 w-1/2 md:w-1/3">
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

export default EditProduct;
