import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../../components/Spinner/Loader.jsx";
import Service from "./Service.jsx";
import LoadMoreButton from "../../../../../../components/LoadMoreButton.jsx";
import {
	setServicesArr,
	addServicesArr,
	setHasServices,
	setIsLoadingServices,
	resetState,
	setOriginalServicesArr,
} from "../../../../../../features/serviceSlice.js";
let currentRequest;

const Services = ({ getServicePath, searchServicePath, setLoading }) => {
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const { servicesArr, hasServices, isLoadingServices, serviceCategory } =
		useSelector((store) => store.service);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${getServicePath}?userId=${user._id}&serviceIds=${JSON.stringify(
					servicesArr.map((service) => service._id)
				)}&category=${serviceCategory}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnServices } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addServicesArr(returnServices));
				if (returnServices.length < 15) {
					sliceDispatch(setHasServices(false));
				}
			} else if (msg === "Services not found") {
				enqueueSnackbar("Services not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	const handleLoadMoreSearch = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${searchServicePath}?userId=${
					user._id
				}&searchText=${searchText}&serviceIds=${JSON.stringify(
					servicesArr.map((service) => service._id)
				)}&category=${serviceCategory}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok && res.status === 403) {
				setLoadMore(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnServices } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addServicesArr(returnServices));
				if (returnServices.length < 15) {
					sliceDispatch(setHasServices(false));
				}
			} else if (msg === "Fail to retrieve services") {
				enqueueSnackbar("Fail to retrieve services", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoadMore(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoadMore(false);
		}
	};

	// get services
	useEffect(() => {
		const getServices = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;

				if (currentRequest) {
					currentRequest.abort();
				}

				currentRequest = abortController;

				setLoading(true);
				sliceDispatch(setIsLoadingServices(true));

				const res = await fetch(
					`${getServicePath}?userId=${user._id}&serviceIds=${JSON.stringify(
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
					setLoading(false);
					sliceDispatch(setIsLoadingServices(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnServices } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setServicesArr(returnServices));
					sliceDispatch(setOriginalServicesArr(returnServices));
					if (returnServices.length < 15) {
						sliceDispatch(setHasServices(false));
					} else {
						sliceDispatch(setHasServices(true));
					}
				} else if (msg === "Services not found") {
					enqueueSnackbar("Services not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				sliceDispatch(setIsLoadingServices(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
					setLoading(false);
					sliceDispatch(setIsLoadingServices(true));
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					setLoading(false);
					sliceDispatch(setIsLoadingServices(false));
				}
			}
		};

		getServices();
	}, [getServicePath, serviceCategory]);

	// cancel request
	useEffect(() => {
		return () => {
			if (currentRequest) {
				currentRequest.abort();
			}
		};
	}, []);

	// reset state
	useEffect(() => {
		return () => {
			sliceDispatch(resetState());
		};
	}, [getServicePath]);

	return (
		<div className="mt-3">
			{isLoadingServices ? (
				<Loader />
			) : servicesArr.length > 0 ? (
				<div className="grid grid-cols-12 gap-4 px-2 max-img-height overflow-y-auto marketplace-content-height mb-2">
					{servicesArr.map((service) => (
						<Service key={service._id} service={service} />
					))}
					<div className="col-span-12">
						<LoadMoreButton
							handleLoadMore={
								searchText === "" ? handleLoadMore : handleLoadMoreSearch
							}
							hasComponent={hasServices}
							isLoadingComponent={isLoadingServices}
							loadMore={loadMore}
						/>
					</div>
				</div>
			) : (
				<h2>No service</h2>
			)}
		</div>
	);
};

export default Services;
