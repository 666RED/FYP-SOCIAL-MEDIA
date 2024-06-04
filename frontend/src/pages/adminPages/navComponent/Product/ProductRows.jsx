import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import ProductRow from "./ProductRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { productContext } from "./ProductPage.jsx";

const ProductRows = () => {
	const { loading, currentProducts, indexOfFirstProduct } =
		useContext(productContext);

	return loading ? (
		<Loader />
	) : currentProducts.length > 0 ? (
		currentProducts.map((product, index) => (
			<ProductRow
				product={product}
				key={product._id}
				count={indexOfFirstProduct + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default ProductRows;
