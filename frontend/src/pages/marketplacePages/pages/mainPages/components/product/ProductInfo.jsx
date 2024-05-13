import { React, useContext } from "react";
import { ServerContext } from "../../../../../../App.js";

const ProductInfo = ({ product }) => {
	const serverURL = useContext(ServerContext);
	const productImagePath = `${serverURL}/public/images/product/`;

	return (
		<div className="flex flex-col">
			{/* PRODUCT IMAGE */}
			<img
				src={`${productImagePath}${product.productImagePath}`}
				alt="Product image"
				className="rounded-xl self-center max-h-[30rem]"
			/>
			{/* PRODUCT NAME */}
			<p className="mt-3 border border-gray-400 rounded-xl p-3">
				{product.productName}
			</p>
			{/* PRODUCT DESCRIPTION */}
			<p className="my-2 border border-gray-400 rounded-xl p-3">
				{product.productDescription}
			</p>
			{/* PRODUCT PRICE */}
			<p className="border border-gray-400 rounded-xl p-3">
				{`RM ${Number(product.productPrice).toFixed(2)}`}
			</p>
			{/* PRODUCT QUANTITY */}
			<p className="my-2 border border-gray-400 rounded-xl p-3">
				{`${product.productQuantity} remaining`}
			</p>
		</div>
	);
};

export default ProductInfo;
