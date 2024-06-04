import { React, useEffect, useContext, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Pagination from "../../components/Pagination.jsx";
import SearchBar from "../../../../components/SearchBar.jsx";
import PageTemplate from "../../components/PageTemplate.jsx";
import TableTemplate from "../../components/TableTemplate.jsx";
import ProductHead from "./ProductHead.jsx";
import ProductRows from "./ProductRows.jsx";
import { setSearchText } from "../../../../features/searchSlice.js";
import { ServerContext } from "../../../../App.js";
export const productContext = createContext(null);
let currentRequest;

const ProductPage = () => {
	const sliceDispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [disableSearch, setDisableSearch] = useState(true);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.admin);
	const { searchText } = useSelector((store) => store.search);

	const [productRows, setProductRows] = useState([]);
	const [originalProductRows, setOriginalProductRows] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastProduct = currentPage * 10;
	const indexOfFirstProduct = indexOfLastProduct - 10;
	const currentProducts = productRows.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);

	// get all products
	useEffect(() => {
		const abortController = new AbortController();
		const { signal } = abortController;
		currentRequest = abortController;

		const retrieveProducts = async () => {
			try {
				setLoading(true);

				const res = await fetch(`${serverURL}/admin/retrieve-products`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					signal,
				});

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, products } = await res.json();

				if (msg === "Success") {
					setProductRows(products);
					setOriginalProductRows(products);
					setDisableSearch(false);
				} else if (msg === "Fail to retrieve products") {
					enqueueSnackbar("Fail to retrieve products", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			} catch (err) {
				if (err.name === "AbortError") {
					console.log("Request was aborted");
				} else {
					enqueueSnackbar("Could not connect to the server", {
						variant: "error",
					});
				}
				setLoading(false);
			}
		};

		retrieveProducts();

		return () => {
			currentRequest.abort();
			sliceDispatch(setSearchText(""));
		};
	}, []);

	const handleOnChange = async (payload) => {
		try {
			const abortController = new AbortController();
			const { signal } = abortController;

			if (currentRequest) {
				currentRequest.abort();
			}

			currentRequest = abortController;

			setLoading(true);
			sliceDispatch(setSearchText(payload));
			setCurrentPage(1);

			const res = await fetch(
				`${serverURL}/admin/search-products?searchText=${payload.trim()}`,
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
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, products } = await res.json();

			if (msg === "Success") {
				setProductRows(products);
			} else if (msg === "Stop searching") {
				setProductRows(originalProductRows);
			} else if (msg === "Products not found") {
				enqueueSnackbar("Products not found", { variant: "error" });
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
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

	return (
		<PageTemplate
			component={
				<productContext.Provider
					value={{ currentProducts, loading, indexOfFirstProduct }}
				>
					<div className="mt-3 mb-5 flex items-center">
						{/* TITLE */}
						<h1 className="font-semibold mr-2 text-[20px] md:text-[30px]">
							Product
						</h1>
						{/* SEARCH BAR */}
						<SearchBar
							func={handleOnChange}
							placeholderText="Product name"
							text={searchText}
							isDisabled={disableSearch}
						/>
					</div>
					{/* TABLE */}
					<TableTemplate body={<ProductRows />} head={<ProductHead />} />
					{/* PAGINATION */}
					<Pagination
						loading={loading}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						rows={productRows}
					/>
				</productContext.Provider>
			}
			selectedSection="Product"
		/>
	);
};

export default ProductPage;
