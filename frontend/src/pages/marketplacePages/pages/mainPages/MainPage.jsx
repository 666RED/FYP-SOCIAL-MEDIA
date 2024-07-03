import { React, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Error from "../../../../components/Error.jsx";
import SideBar from "../../../../components/Sidebar/SideBar.jsx";
import Header from "../../../../components/Header.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import Products from "./components/product/Products.jsx";
import Services from "./components/service/Services.jsx";
import Events from "./components/event/Events.jsx";
import {
	resetSearchText,
	setSearchText,
} from "../../../../features/searchSlice.js";
import {
	setHasProducts,
	setIsLoadingProducts,
	setProductsArr,
} from "../../../../features/productSlice.js";
import {
	setHasServices,
	setIsLoadingServices,
	setServicesArr,
	setServiceCategory,
} from "../../../../features/serviceSlice.js";
import {
	setHasEvents,
	setIsLoadingEvents,
	setEventsArr,
	setEventCategory,
} from "../../../../features/eventSlice.js";
import { ServerContext } from "../../../../App.js";
let currentRequest;

const MainPage = () => {
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { originalProductsArr } = useSelector((store) => store.product);
	const { originalServicesArr, serviceCategory } = useSelector(
		(store) => store.service
	);
	const { originalEventsArr, eventCategory } = useSelector(
		(store) => store.event
	);
	const { searchText } = useSelector((store) => store.search);
	const { enqueueSnackbar } = useSnackbar();

	const [extendSideBar, setExtendSideBar] = useState(false);
	const [currentNav, setCurrentNav] = useState("Product");
	const [category, setCategory] = useState("products");
	const [loading, setLoading] = useState(false);

	// reset search text
	useEffect(() => {
		return () => {
			sliceDispatch(resetSearchText());
		};
	}, []);

	const handleShowProduct = () => {
		setCurrentNav("Product");
		setCategory("products");
		sliceDispatch(resetSearchText());
	};

	const handleShowService = () => {
		setCurrentNav("Service");
		setCategory("services");
		sliceDispatch(resetSearchText());
	};

	const handleShowEvent = () => {
		setCurrentNav("Event");
		setCategory("events");
		sliceDispatch(resetSearchText());
	};

	const handleOnChange = (e) => {
		setCategory(e.target.value);
		sliceDispatch(resetSearchText());
		sliceDispatch(setServiceCategory("all"));
		sliceDispatch(setEventCategory("all"));
	};

	const handleOnChangeCategory = (e) => {
		sliceDispatch(resetSearchText());
		sliceDispatch(setServiceCategory(e.target.value));
	};

	const handleOnChangeEventCategory = (e) => {
		sliceDispatch(resetSearchText());
		sliceDispatch(setEventCategory(e.target.value));
	};

	const searchProducts = async (payload) => {
		try {
			const path =
				category === "products"
					? `${serverURL}/product/get-searched-products`
					: `${serverURL}/product/get-searched-my-products`;

			const abortController = new AbortController();
			const { signal } = abortController;

			if (currentRequest) {
				currentRequest.abort();
			}

			currentRequest = abortController;

			sliceDispatch(setIsLoadingProducts(true));
			sliceDispatch(setSearchText(payload));

			const res = await fetch(
				`${path}?userId=${
					user._id
				}&searchText=${payload.trim()}&productIds=${JSON.stringify([])}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				}
			);

			if (!res.ok && res.status === 403) {
				sliceDispatch(setIsLoadingProducts(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnProducts } = await res.json();

			if (msg === "Success") {
				if (returnProducts.length < 15) {
					sliceDispatch(setHasProducts(false));
				} else {
					sliceDispatch(setHasProducts(true));
				}

				sliceDispatch(setProductsArr(returnProducts));
			} else if (msg === "Stop searching") {
				sliceDispatch(setProductsArr(originalProductsArr));
				if (originalProductsArr.length >= 15) {
					sliceDispatch(setHasProducts(true));
				}
			} else if (msg === "Fail to retrieve products") {
				enqueueSnackbar("Fail to retrieve products", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingProducts(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	const searchServices = async (payload) => {
		try {
			const path =
				category === "services"
					? `${serverURL}/service/get-searched-services`
					: `${serverURL}/service/get-searched-my-services`;

			const abortController = new AbortController();
			const { signal } = abortController;

			if (currentRequest) {
				currentRequest.abort();
			}

			currentRequest = abortController;

			sliceDispatch(setIsLoadingServices(true));
			sliceDispatch(setSearchText(payload));

			const res = await fetch(
				`${path}?userId=${
					user._id
				}&searchText=${payload.trim()}&serviceIds=${JSON.stringify(
					[]
				)}&category=${serviceCategory}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				}
			);

			if (!res.ok && res.status === 403) {
				sliceDispatch(setIsLoadingServices(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnServices } = await res.json();

			if (msg === "Success") {
				if (returnServices.length < 15) {
					sliceDispatch(setHasServices(false));
				} else {
					sliceDispatch(setHasServices(true));
				}

				sliceDispatch(setServicesArr(returnServices));
			} else if (msg === "Stop searching") {
				sliceDispatch(setServicesArr(originalServicesArr));
				if (originalServicesArr.length >= 15) {
					sliceDispatch(setHasServices(true));
				}
			} else if (msg === "Fail to retrieve services") {
				enqueueSnackbar("Fail to retrieve services", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			sliceDispatch(setIsLoadingServices(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	const searchEvents = async (payload) => {
		try {
			const path =
				category === "events"
					? `${serverURL}/event/get-searched-events`
					: `${serverURL}/event/get-searched-my-events`;

			const abortController = new AbortController();
			const { signal } = abortController;

			if (currentRequest) {
				currentRequest.abort();
			}

			currentRequest = abortController;

			sliceDispatch(setIsLoadingEvents(true));
			sliceDispatch(setSearchText(payload));

			const res = await fetch(
				`${path}?userId=${
					user._id
				}&searchText=${payload.trim()}&eventIds=${JSON.stringify(
					[]
				)}&category=${eventCategory}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				}
			);

			if (!res.ok && res.status === 403) {
				sliceDispatch(setIsLoadingEvents(false));
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnEvents } = await res.json();

			if (msg === "Success") {
				if (returnEvents.length < 15) {
					sliceDispatch(setHasEvents(false));
				} else {
					sliceDispatch(setHasEvents(true));
				}

				sliceDispatch(setEventsArr(returnEvents));
			} else if (msg === "Stop searching") {
				sliceDispatch(setEventsArr(originalEventsArr));
				if (originalEventsArr.length >= 15) {
					sliceDispatch(setHasEvents(true));
				}
			} else if (msg === "Fail to retrieve events") {
				enqueueSnackbar("Fail to retrieve events", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}
			sliceDispatch(setIsLoadingEvents(false));
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
			} else {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		}
	};

	return user && token ? (
		<div className="flex flex-col h-full">
			{/* SIDEBAR */}
			<SideBar
				selectedSection="MarketPlace"
				setExtendSideBar={setExtendSideBar}
				extendSideBar={extendSideBar}
			/>
			{/* HEADER */}
			<Header
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				title="MarketPlace"
			/>
			{/* NAV BUTTONS */}
			<div className="px-2 grid grid-cols-12 items-end">
				<div className="flex col-span-8">
					{/* PRODUCT NAV */}
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-[13px] min-[361px]:text-base ${
							currentNav === "Product" && "bg-gray-200 font-semibold"
						}`}
						onClick={currentNav === "Product" ? null : handleShowProduct}
					>
						Product
					</p>
					{/* SERVICE NAV */}
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-[13px] min-[361px]:text-base ${
							currentNav === "Service" && "bg-gray-200 font-semibold"
						}`}
						onClick={currentNav === "Service" ? null : handleShowService}
					>
						Service
					</p>
					{/* EVENT NAV */}
					<p
						className={`hover:bg-gray-200 cursor-pointer text-center py-1 mr-2 flex-1 rounded-xl text-[13px] min-[361px]:text-base ${
							currentNav === "Event" && "bg-gray-200 font-semibold"
						}`}
						onClick={currentNav === "Event" ? null : handleShowEvent}
					>
						Event
					</p>
				</div>
				{/* CREATE NEW BUTTON */}
				<button
					className="btn-green col-span-4 md:col-start-11 md:col-span-2 text-[13px] min-[361px]:text-base"
					onClick={() => navigate("/marketplace/create-new-item")}
				>
					Create New
				</button>
			</div>
			{/* HORIZONTAL LINE */}
			<hr className="border-4 border-gray-400 my-3" />
			{/* MAIN CONTENT */}
			<div className="md:flex md:items-center mx-2">
				{/* SEARCH BAR */}
				<SearchBar
					func={
						currentNav === "Product"
							? searchProducts
							: currentNav === "Service"
							? searchServices
							: searchEvents
					}
					placeholderText="Search..."
					text={searchText}
					isDisabled={loading}
				/>
				<div className="flex items-center md:ml-3 md:mt-0 mt-2">
					{/* DROP DOWN */}
					{currentNav === "Product" ? (
						// PRODUCT DROP DOWN
						<select
							className=" border border-gray-400 rounded-xl p-2"
							onChange={handleOnChange}
							value={category}
						>
							<option value="products" className="py-1">
								Explore
							</option>
							<option value="my-products" className="py-1">
								My products
							</option>
						</select>
					) : currentNav === "Service" ? (
						// SERVICE DROP DOWN
						<div className=" flex items-center">
							<select
								className="border border-gray-400 rounded-xl p-2"
								value={category}
								onChange={handleOnChange}
							>
								<option value="services" className="py-1">
									Explore
								</option>
								<option value="my-services" className="py-1">
									My services
								</option>
							</select>
							{/* SERVICE CATEGORY */}
							<select
								className="ml-2 border border-gray-400 rounded-xl p-2 text-sm md:text-base"
								value={serviceCategory}
								onChange={handleOnChangeCategory}
							>
								<option value="all">All</option>
								<option value="tutoring">Tutoring</option>
								<option value="academic-writing-assistance">
									Academic writing assistance
								</option>
								<option value="graphic-design">Graphic design</option>
								<option value="photography-/-videography">
									Photography / Videography
								</option>
								<option value="it-support">IT support</option>
								<option value="language-translation">
									Language translation
								</option>
								<option value="event-planning">Event planning</option>
								<option value="car-hire">Car hire</option>
								<option value="food-delivery">Food delivery</option>
								<option value="other">Other</option>
							</select>
						</div>
					) : (
						// EVENT DROP DOWN
						<div className="flex items-center">
							<select
								className=" border border-gray-400 rounded-xl p-2"
								onChange={handleOnChange}
								value={category}
							>
								<option value="events" className="py-1">
									Explore
								</option>
								<option value="my-events" className="py-1">
									My events
								</option>
							</select>
							{/* EVENT CATEGORY */}
							<select
								className="ml-2 border border-gray-400 rounded-xl p-2"
								value={eventCategory}
								onChange={handleOnChangeEventCategory}
							>
								<option value="all">All</option>
								<option value="one-day">One day</option>
								<option value="multiple-days">Multiple days</option>
							</select>
						</div>
					)}
				</div>
			</div>
			{/* CONTENT */}
			{category === "products" ? (
				<Products
					getProductPath={`${serverURL}/product/get-products`}
					searchProductPath={`${serverURL}/product/get-searched-products`}
					setLoading={setLoading}
				/>
			) : category === "my-products" ? (
				<Products
					getProductPath={`${serverURL}/product/get-my-products`}
					searchProductPath={`${serverURL}/product/get-searched-my-products`}
					setLoading={setLoading}
				/>
			) : category === "services" ? (
				<Services
					getServicePath={`${serverURL}/service/get-services`}
					searchServicePath={`${serverURL}/service/get-searched-services`}
					setLoading={setLoading}
				/>
			) : category === "my-services" ? (
				<Services
					getServicePath={`${serverURL}/service/get-my-services`}
					searchServicePath={`${serverURL}/service/get-searched-my-services`}
					setLoading={setLoading}
				/>
			) : category === "events" ? (
				<Events
					getEventPath={`${serverURL}/event/get-events`}
					searchEventPath={`${serverURL}/event/get-searched-events`}
					setLoading={setLoading}
				/>
			) : (
				<Events
					getEventPath={`${serverURL}/event/get-my-events`}
					searchEventPath={`${serverURL}/event/get-searched-my-events`}
					setLoading={setLoading}
				/>
			)}
		</div>
	) : (
		<Error />
	);
};

export default MainPage;
