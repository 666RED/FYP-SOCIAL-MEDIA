import { React, useContext, useState, useReducer, createContext } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import DirectBackArrowHeader from "../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../components/Error.jsx";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import CreateProduct from "./components/CreateProduct.jsx";
import CreateService from "./components/CreateService.jsx";
import CreateEvent from "./components/CreateEvent.jsx";
import {
	createProductReducer,
	PRODUCT_INITIAL_STATE,
} from "./features/createProductReducer.js";
import {
	createServiceReducer,
	SERVICE_INITIAL_STATE,
} from "./features/createServiceReducer.js";
import {
	createEventReducer,
	EVENT_INITIAL_STATE,
} from "./features/createEventReducer.js";
import PRODUCT_ACTION_TYPES from "./actionTypes/createProductActionTypes.js";
import SERVICE_ACTION_TYPES from "./actionTypes/createServiceActionTypes.js";
import EVENT_ACTION_TYPES from "./actionTypes/createEventActionTypes.js";
import { ServerContext } from "../../../../App.js";
export const EventContext = createContext();

const CreateNewItem = () => {
	const { user, token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const [productState, productDispatch] = useReducer(
		createProductReducer,
		PRODUCT_INITIAL_STATE
	);
	const [serviceState, serviceDispatch] = useReducer(
		createServiceReducer,
		SERVICE_INITIAL_STATE
	);
	const [eventState, eventDispatch] = useReducer(
		createEventReducer,
		EVENT_INITIAL_STATE
	);

	const [currentNav, setCurrentNav] = useState("Product");
	const [loading, setLoading] = useState(false);

	const handleChangeNav = (e) => {
		const nav = e.target.innerText;

		if (currentNav !== nav) {
			if (
				productState.madeChanges ||
				serviceState.madeChanges ||
				eventState.madeChanges
			) {
				const ans = window.confirm("Discard changes?");
				if (ans) {
					productDispatch({
						type: PRODUCT_ACTION_TYPES.RESET_STATE,
					});
					serviceDispatch({ type: SERVICE_ACTION_TYPES.RESET_STATE });
					eventDispatch({ type: EVENT_ACTION_TYPES.RESET_STATE });
					setCurrentNav(nav);
				}
				return;
			}
			// no changes
			setCurrentNav(nav);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (productState.madeChanges) {
			handleProductSubmit();
		} else if (serviceState.madeChanges) {
			handleServiceSubmit();
		} else if (eventState.madeChanges) {
			handleEventSubmit();
		}
	};

	const handleProductSubmit = async () => {
		try {
			if (productState.name.trim() === "") {
				enqueueSnackbar("Please enter product name", {
					variant: "warning",
				});
				document.querySelector("#product-name").value = "";
				document.querySelector("#product-name").focus();
				return;
			} else if (productState.name.trim().length < 3) {
				enqueueSnackbar("Product name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#product-name").value = "";
				document.querySelector("#product-name").focus();
				return;
			} else if (productState.description.trim() === "") {
				enqueueSnackbar("Please enter product description", {
					variant: "warning",
				});
				document.querySelector("#product-description").value = "";
				document.querySelector("#product-description").focus();
				return;
			} else if (productState.imagePath === "") {
				enqueueSnackbar("Please upload a product image", {
					variant: "warning",
				});
				return;
			}

			setLoading(true);

			const formdata = new FormData();
			formdata.append("name", productState.name.trim());
			formdata.append("description", productState.description.trim());
			formdata.append("image", productState.image);
			formdata.append("price", productState.price);
			formdata.append("quantity", productState.quantity);
			formdata.append("userId", user._id);
			formdata.append("contactNumber", productState.contactNumber);

			const res = await fetch(`${serverURL}/product/create-new-product`, {
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				setLoading(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("New product created", { variant: "success" });
				navigate("/marketplace");
			} else if (msg === "Fail to create new product") {
				enqueueSnackbar("Fail to create new product", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	const handleServiceSubmit = async () => {
		try {
			if (serviceState.name.trim() === "") {
				enqueueSnackbar("Please enter service name", {
					variant: "warning",
				});
				document.querySelector("#service-name").value = "";
				document.querySelector("#service-name").focus();
				return;
			} else if (serviceState.name.trim().length < 3) {
				enqueueSnackbar("Service name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#service-name").value = "";
				document.querySelector("#service-name").focus();
				return;
			} else if (serviceState.description.trim() === "") {
				enqueueSnackbar("Please enter service description", {
					variant: "warning",
				});
				document.querySelector("#service-description").value = "";
				document.querySelector("#service-description").focus();
				return;
			} else if (serviceState.imagePath === "") {
				enqueueSnackbar("Please upload a service poster image", {
					variant: "warning",
				});
				return;
			}

			setLoading(true);

			const formdata = new FormData();
			formdata.append("name", serviceState.name.trim());
			formdata.append("description", serviceState.description.trim());
			formdata.append("image", serviceState.image);
			formdata.append("userId", user._id);
			formdata.append("contactNumber", serviceState.contactNumber);
			formdata.append("category", serviceState.category);

			const res = await fetch(`${serverURL}/service/create-new-service`, {
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("New service created", { variant: "success" });
				navigate("/marketplace");
			} else if (msg === "Fail to create new service") {
				enqueueSnackbar("Fail to create new service", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	const handleEventSubmit = async () => {
		try {
			if (eventState.name.trim() === "") {
				enqueueSnackbar("Please enter event name", {
					variant: "warning",
				});
				document.querySelector("#event-name").value = "";
				document.querySelector("#event-name").focus();
				return;
			} else if (eventState.name.trim().length < 3) {
				enqueueSnackbar("Event name should not less than 3 characters", {
					variant: "warning",
				});
				document.querySelector("#event-name").value = "";
				document.querySelector("#event-name").focus();
				return;
			} else if (eventState.description.trim() === "") {
				enqueueSnackbar("Please enter event description", {
					variant: "warning",
				});
				document.querySelector("#event-description").value = "";
				document.querySelector("#event-description").focus();
				return;
			} else if (eventState.venue.trim() === "") {
				enqueueSnackbar("Please enter event venue", {
					variant: "warning",
				});
				document.querySelector("#event-venue").value = "";
				document.querySelector("#event-venue").focus();
				return;
			} else if (eventState.organizer.trim() === "") {
				enqueueSnackbar("Please enter event organizer", {
					variant: "warning",
				});
				document.querySelector("#event-organizer").value = "";
				document.querySelector("#event-organizer").focus();
				return;
			} else if (eventState.imagePath === "") {
				enqueueSnackbar("Please upload an event poster image", {
					variant: "warning",
				});
				return;
			}

			setLoading(true);

			const contactNumberArr = eventState.contactNumbers.map(
				(num) => num.number
			);

			const formdata = new FormData();
			formdata.append("name", eventState.name.trim());
			formdata.append("description", eventState.description.trim());
			formdata.append("venue", eventState.venue.trim());
			formdata.append("contactNumbers", JSON.stringify(contactNumberArr));
			formdata.append("userId", user._id);
			formdata.append("image", eventState.image);
			formdata.append("isOneDayEvent", eventState.isOneDayEvent);
			formdata.append("organizer", eventState.organizer.trim());

			if (eventState.isOneDayEvent) {
				formdata.append("oneDate", eventState.oneDate);
				formdata.append("startTime", eventState.startTime);
				formdata.append("endTime", eventState.endTime);
			} else {
				formdata.append("startDate", eventState.startDate);
				formdata.append("endDate", eventState.endDate);
			}

			const res = await fetch(`${serverURL}/event/create-new-event`, {
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("New event created", { variant: "success" });
				navigate("/marketplace");
			} else if (msg === "Fail to create new event") {
				enqueueSnackbar("Fail to create new event", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	return user && token ? (
		<form
			onSubmit={handleSubmit}
			className="page-layout-with-back-arrow"
			autoComplete="off"
		>
			{loading && <Spinner />}
			{/* HEADER */}
			<DirectBackArrowHeader
				destination="/marketplace"
				title="Create new item"
				discardChanges={
					productState.madeChanges ||
					serviceState.madeChanges ||
					eventState.madeChanges
				}
			/>
			{/* MAIN CONTENT CONTAINER */}
			<div className="md:w-2/3 mx-auto">
				{/* NAVIGATION ROW */}
				<div className="flex items-center mt-3">
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-lg ${
							currentNav === "Product" && "bg-gray-200 font-semibold"
						}`}
						onClick={handleChangeNav}
					>
						Product
					</p>
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-lg ${
							currentNav === "Service" && "bg-gray-200 font-semibold"
						}`}
						onClick={handleChangeNav}
					>
						Service
					</p>
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-lg ${
							currentNav === "Event" && "bg-gray-200 font-semibold"
						}`}
						onClick={handleChangeNav}
					>
						Event
					</p>
				</div>
				{/* MAIN CONTENT */}
				{currentNav === "Product" ? (
					<CreateProduct state={productState} dispatch={productDispatch} />
				) : currentNav === "Service" ? (
					<CreateService state={serviceState} dispatch={serviceDispatch} />
				) : (
					<EventContext.Provider
						value={{ state: eventState, dispatch: eventDispatch }}
					>
						<CreateEvent />
					</EventContext.Provider>
				)}
				{/* CREATE BUTTON */}
				<button className="btn-green mt-8 block mx-auto w-1/2 md:w-1/4 mb-5">
					CREATE
				</button>
			</div>
		</form>
	) : (
		<Error />
	);
};

export default CreateNewItem;
