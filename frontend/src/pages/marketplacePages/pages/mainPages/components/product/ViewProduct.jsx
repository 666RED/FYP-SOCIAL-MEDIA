import { React, useEffect, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdReport } from "react-icons/md";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../../../components/Error.jsx";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import ProductInfo from "./ProductInfo.jsx";
import SellerInfo from "../../../../../../components/SellerInfo.jsx";
import ReportForm from "../../../../../../components/post/ReportForm.jsx";
import {
	viewProductReducer,
	INITIAL_STATE,
} from "./feature/viewProductReducer.js";
import ACTION_TYPES from "./actionTypes/viewProductActionTypes.js";
import { ServerContext } from "../../../../../../App.js";

const ViewProduct = () => {
	const { id } = useParams();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(viewProductReducer, INITIAL_STATE);
	const navigate = useNavigate();

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

	const handleOnClick = () => {
		const previousArr = JSON.parse(localStorage.getItem("previous")) || [];
		previousArr.push(`/marketplace/product/view-product/${id}`);
		localStorage.setItem("previous", JSON.stringify(previousArr));
		navigate(`/profile/${state.userId}`);
	};

	const handleReport = async () => {
		dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM });
	};

	return user && token ? (
		<div className="page-layout-with-back-arrow pb-5 relative">
			{/* REPORT FORM */}
			{state.showReportForm && (
				<ReportForm
					type="Product"
					id={id}
					toggleShowReportForm={() =>
						dispatch({ type: ACTION_TYPES.TOGGLE_SHOW_REPORT_FORM })
					}
				/>
			)}
			{/* HEADER */}
			<DirectBackArrowHeader destination="/marketplace" title="View Product" />
			{state.loading ? (
				<Spinner />
			) : (
				/* FORM CONTAINER */
				<form className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3">
					{/* PRODUCT INFORMATION */}
					<ProductInfo product={state} />
					{/* HORIZONTAL LINE */}
					<hr className="my-2 border border-gray-400" />
					{/* SELLER INFORMATION */}
					<SellerInfo
						name="Product Seller"
						state={state}
						handleOnClick={handleOnClick}
					/>
				</form>
			)}
			{/* REPORT ICON */}
			{user._id !== state.userId && (
				<MdReport
					className="text-3xl cursor-pointer hover:opacity-80 text-red-600 absolute top-1 right-1"
					onClick={handleReport}
				/>
			)}
		</div>
	) : (
		<Error />
	);
};

export default ViewProduct;
