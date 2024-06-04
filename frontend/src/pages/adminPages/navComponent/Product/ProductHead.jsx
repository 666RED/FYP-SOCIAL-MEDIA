import React from "react";

const ProductHead = () => {
	return (
		<thead>
			<tr>
				<th className="font-semibold">#</th>
				<th className="font-semibold text-left">Name</th>
				<th className="font-semibold text-left">Description</th>
				<th className="font-semibold">Image</th>
				<th className="font-semibold text-left">Poster</th>
				<th className="font-semibold text-left">Price</th>
				<th className="font-semibold text-left">Contact number</th>
				<th className="font-semibold">Uploaded</th>
				<th className="font-semibold">Status</th>
			</tr>
		</thead>
	);
};

export default ProductHead;
