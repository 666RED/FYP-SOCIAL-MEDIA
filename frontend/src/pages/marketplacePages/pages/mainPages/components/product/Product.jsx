import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPhoneAlt, FaDollarSign } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { ServerContext } from "../../../../../../App.js";

const Product = ({ product }) => {
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);

	const filePath = `${serverURL}/public/images/product/`;
	const path =
		product.userId === user._id
			? `/marketplace/product/edit-product/${product._id}`
			: `/marketplace/product/view-product/${product._id}`;

	return (
		<div
			className="col-span-6 md:col-span-4 lg:col-span-3 rounded-xl p-3 my-2 border shadow-xl border-gray-300 marketplace-card flex flex-col cursor-pointer hover:bg-gray-200"
			onClick={() => navigate(path)}
		>
			{/* PRODUCT IMAGE */}
			<img
				src={`${filePath}${product.productImagePath}`}
				alt="Product image"
				className="col-span-2 border border-blue-400 rounded-lg self-center mb-2 flex-1 w-full"
			/>
			{/* PRODUCT NAME */}
			<p>{product.productName}</p>
			{/* PRODUCT PRICE */}
			<div className="flex items-center">
				<FaDollarSign />
				<p className="ml-2">RM {Number(product.productPrice).toFixed(2)}</p>
			</div>
			{/* PRODUCT QUANTITY */}
			{product.productQuantity < 1 ? (
				<p>Out of stock</p>
			) : (
				<div className="flex items-center">
					<MdOutlineProductionQuantityLimits />
					<p className="ml-2">{product.productQuantity} remaining</p>
				</div>
			)}
			{/* CONTACT NUMBER */}
			<div className="flex items-center">
				<FaPhoneAlt className="mr-2" />
				<p>{product.contactNumber}</p>
			</div>
		</div>
	);
};

export default Product;
