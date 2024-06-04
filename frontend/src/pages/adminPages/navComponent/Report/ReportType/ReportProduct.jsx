import React from "react";
import ProductInfo from "../../../../marketplacePages/pages/mainPages/components/product/ProductInfo.jsx";
import SellerInfo from "../../../../../components/SellerInfo.jsx";

const ReportProduct = ({ target }) => {
	return (
		<div className="mx-auto w-4/5 md:max-w-[50rem] border border-gray-500 rounded-xl mt-5 p-3">
			{/* PRODUCT INFORMATION */}
			<ProductInfo product={target} />
			{/* HORIZONTAL LINE */}
			<hr className="my-2 border border-gray-400" />
			{/* SELLER INFORMATION */}
			<SellerInfo
				handleOnClick={null}
				name="Product Seller"
				state={target}
				isAdmin={true}
			/>
		</div>
	);
};

export default ReportProduct;
