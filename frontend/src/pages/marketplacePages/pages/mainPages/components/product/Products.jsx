import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Loader from "../../../../../../components/Spinner/Loader.jsx";
import Product from "./Product.jsx";
import LoadMoreButton from "../../../../../../components/LoadMoreButton.jsx";
import {
	setProductsArr,
	addProductsArr,
	setHasProducts,
	setIsLoadingProducts,
	resetState,
	setOriginalProductsArr,
} from "../../../../../../features/productSlice.js";
let currentRequest;

const Products = ({ getProductPath, searchProductPath, setLoading }) => {
	const sliceDispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);
	const { searchText } = useSelector((store) => store.search);
	const { productsArr, hasProducts, isLoadingProducts } = useSelector(
		(store) => store.product
	);
	const { enqueueSnackbar } = useSnackbar();
	const [loadMore, setLoadMore] = useState(false);

	const handleLoadMore = async () => {
		try {
			setLoadMore(true);

			const res = await fetch(
				`${getProductPath}?userId=${user._id}&productIds=${JSON.stringify(
					productsArr.map((product) => product._id)
				)}`,
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

			const { msg, returnProducts } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addProductsArr(returnProducts));
				if (returnProducts.length < 15) {
					sliceDispatch(setHasProducts(false));
				}
			} else if (msg === "Products not found") {
				enqueueSnackbar("Products not found", { variant: "error" });
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
				`${searchProductPath}?userId=${
					user._id
				}&searchText=${searchText}&productIds=${JSON.stringify(
					productsArr.map((product) => product._id)
				)}`,
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

			const { msg, returnProducts } = await res.json();

			if (msg === "Success") {
				sliceDispatch(addProductsArr(returnProducts));
				if (returnProducts.length < 15) {
					sliceDispatch(setHasProducts(false));
				}
			} else if (msg === "Fail to retrieve products") {
				enqueueSnackbar("Fail to retrieve products", { variant: "error" });
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

	// get products
	useEffect(() => {
		const getProducts = async () => {
			try {
				const abortController = new AbortController();
				const { signal } = abortController;

				if (currentRequest) {
					currentRequest.abort();
				}

				currentRequest = abortController;

				setLoading(true);
				sliceDispatch(setIsLoadingProducts(true));

				const res = await fetch(
					`${getProductPath}?userId=${user._id}&productIds=${JSON.stringify(
						[]
					)}`,
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
					sliceDispatch(setIsLoadingProducts(false));
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnProducts } = await res.json();

				if (msg === "Success") {
					sliceDispatch(setProductsArr(returnProducts));
					sliceDispatch(setOriginalProductsArr(returnProducts));
					if (returnProducts.length < 15) {
						sliceDispatch(setHasProducts(false));
					} else {
						sliceDispatch(setHasProducts(true));
					}
				} else if (msg === "Products not found") {
					enqueueSnackbar("Products not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
				sliceDispatch(setIsLoadingProducts(false));
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
					setLoading(false);
					sliceDispatch(setIsLoadingProducts(true));
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
					setLoading(false);
					sliceDispatch(setIsLoadingProducts(false));
				}
			}
		};

		getProducts();
	}, [getProductPath]);

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
	}, [getProductPath]);

	return (
		<div className="mt-3">
			{isLoadingProducts ? (
				<Loader />
			) : productsArr.length > 0 ? (
				<div className="grid grid-cols-12 gap-2 px-2 max-img-height overflow-y-auto marketplace-content-height mb-2">
					{productsArr.map((product) => (
						<Product key={product._id} product={product} />
					))}
					<div className="col-span-12">
						<LoadMoreButton
							handleLoadMore={
								searchText === "" ? handleLoadMore : handleLoadMoreSearch
							}
							hasComponent={hasProducts}
							isLoadingComponent={isLoadingProducts}
							loadMore={loadMore}
						/>
					</div>
				</div>
			) : (
				<h2>No product</h2>
			)}
		</div>
	);
};

export default Products;
