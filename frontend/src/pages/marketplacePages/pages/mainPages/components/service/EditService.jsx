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
	editServiceReducer,
	INITIAL_STATE,
} from "./feature/editServiceReducer.js";
import ACTION_TYPES from "./actionTypes/editServiceActionTypes.js";
import { ServerContext } from "../../../../../../App.js";

const EditService = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const [state, dispatch] = useReducer(editServiceReducer, INITIAL_STATE);

	// first render
	useEffect(() => {
		const getService = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/service/get-service?id=${id}`, {
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

				const { msg, service } = await res.json();

				if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.FIRST_RENDER,
						payload: service,
					});
				} else if (msg === "Service not found") {
					enqueueSnackbar("Service not found", {
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

		getService();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (state.serviceName.trim() === "") {
				enqueueSnackbar("Please enter service name", {
					variant: "warning",
				});
				document.querySelector("#service-name").value = "";
				document.querySelector("#service-name").focus();
				return;
			} else if (state.serviceName.trim().length < 3) {
				enqueueSnackbar("Service name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#service-name").value = "";
				document.querySelector("#service-name").focus();
				return;
			} else if (state.serviceDescription.trim() === "") {
				enqueueSnackbar("Please enter service description", {
					variant: "warning",
				});
				document.querySelector("#service-description").value = "";
				document.querySelector("#service-description").focus();
				return;
			} else if (state.servicePosterImagePath === "") {
				enqueueSnackbar("Please upload a service image", {
					variant: "warning",
				});
				return;
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const formdata = new FormData();
			formdata.append("serviceId", id);
			formdata.append("name", state.serviceName.trim());
			formdata.append("description", state.serviceDescription.trim());
			formdata.append("category", state.serviceCategory);
			formdata.append("contactNumber", state.contactNumber);
			formdata.append("image", state.image);

			const res = await fetch(`${serverURL}/service/edit-service`, {
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
				enqueueSnackbar("Service edited", { variant: "success" });
				navigate("/marketplace");
			} else if (msg === "Fail to edit service") {
				enqueueSnackbar("Fail to edit service", { variant: "error" });
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
			const ans = window.confirm("Remove service?");

			if (ans) {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/service/remove-service`, {
					method: "PATCH",
					body: JSON.stringify({ serviceId: id }),
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
					enqueueSnackbar("Service removed", {
						variant: "success",
					});
					navigate("/marketplace");
				} else if (msg === "Fail to remove service") {
					enqueueSnackbar("Fail to remove service", {
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
		<div className="page-layout-with-back-arrow pb-5 relative">
			{/* HEADER */}
			<DirectBackArrowHeader
				destination="/marketplace"
				title="Edit Service"
				discardChanges={state.madeChanges || state.hasImagePathChanged}
			/>
			{state.loading && <Spinner />}
			{/* FORM CONTAINER */}
			<form
				className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3"
				onSubmit={handleSubmit}
			>
				{/* SERVICE POSTER IMAGE */}
				<h3>Service poster image:</h3>
				<UploadImage
					dispatch={(payload) =>
						dispatch({ type: ACTION_TYPES.UPLOAD_IMAGE, payload })
					}
					imagePath={state.servicePosterImagePath}
				/>
				{/* SERVICE NAME */}
				<h3 className="mt-3">Service name:</h3>
				<input
					type="text"
					id="service-name"
					required
					className="w-full my-1"
					minLength={3}
					maxLength={50}
					value={state.serviceName}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_SERVICE_NAME,
							payload: e.target.value,
						});
					}}
				/>
				{/* SERVICE DESCRIPTION */}
				<h3 className="mt-3">Service description:</h3>
				<textarea
					required
					rows="5"
					className="resize-none my-1 w-full"
					value={state.serviceDescription}
					minLength={1}
					maxLength={200}
					onChange={(e) => {
						dispatch({
							type: ACTION_TYPES.SET_SERVICE_DESCRIPTION,
							payload: e.target.value,
						});
					}}
				/>
				{/* SERVICE CATEGORY */}
				<h3 className="mt-3">Service category:</h3>
				<select
					className="text-sm border-[1px] rounded-xl border-black p-3 my-1"
					onChange={(e) =>
						dispatch({
							type: ACTION_TYPES.SET_SERVICE_CATEGORY,
							payload: e.target.value,
						})
					}
					value={state.serviceCategory}
					required
				>
					<option value="tutoring">Tutoring</option>
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
				{/* EDIT NUMBER */}
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

export default EditService;
