import { React, useState, useContext } from "react";
import FocusImage from "../../components/FocusImage.jsx";
import ImageRow from "../../components/ImageRow.jsx";
import StatusText from "../../components/StatusText.jsx";
import { ServerContext } from "../../../../App.js";

const ProductRow = ({ product, count }) => {
	const serverURL = useContext(ServerContext);
	const [showImage, setShowImage] = useState(false);
	const productImagePath = `${serverURL}/public/images/product/`;

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{product.name}</td>
			<td>{product.description}</td>
			<td>
				<ImageRow
					imagePath={product.imagePath}
					setShowImage={setShowImage}
					imageRemoved={product.removed}
				/>
			</td>
			<td>{product.poster}</td>
			<td>RM {Number(product.price).toFixed(2)}</td>
			<td>{product.contactNumber}</td>
			<td className="text-center">{product.uploaded}</td>
			<StatusText isRemoved={product.removed} />
			{showImage && (
				<FocusImage
					imagePath={`${productImagePath}${product.imagePath}`}
					setShowImage={setShowImage}
				/>
			)}
		</tr>
	);
};

export default ProductRow;
