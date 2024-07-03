import { React } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaDollarSign } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import ContactButton from "../ContactButton.jsx";
import EditButton from "../EditButton.jsx";
import ViewButton from "../ViewButton.jsx";

const Product = ({ product }) => {
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);

	return (
		<div className="col-span-6 md:col-span-4 lg:col-span-3 rounded-xl p-3 my-2 border shadowDesign border-gray-300 marketplace-card flex flex-col">
			{/* PRODUCT IMAGE */}
			<img
				src={product.productImagePath}
				alt="Product image"
				className="col-span-2 border border-blue-400 rounded-lg self-center mb-2 flex-1 max-h-64"
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
			{/* VIEW BUTTON */}
			<ViewButton path={`/marketplace/product/view-product/${product._id}`} />
			{user._id !== product.userId ? (
				// CONTACT BUTTON
				<ContactButton contactUserId={product.userId} marginTop={true} />
			) : (
				// EDIT BUTTON
				<EditButton path={`/marketplace/product/edit-product/${product._id}`} />
			)}
		</div>
	);
};

export default Product;
