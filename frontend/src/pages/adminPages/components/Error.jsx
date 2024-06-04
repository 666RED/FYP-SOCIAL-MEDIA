import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
	const navigate = useNavigate();

	return (
		<div className="m-2">
			<p>
				Access denied. Please{" "}
				<span
					className="cursor-pointer text-blue-500 underline"
					onClick={() => navigate("/admin")}
				>
					Login{" "}
				</span>
				first
			</p>
		</div>
	);
};

export default Error;
