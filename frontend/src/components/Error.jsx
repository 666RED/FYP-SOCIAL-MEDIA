import React from "react";
import { useNavigate } from "react-router";

const Error = () => {
	const navigate = useNavigate();
	return (
		<div className="m-2">
			<p>
				Access denied. Please{" "}
				<span
					className="cursor-pointer text-blue-600 underline"
					onClick={() => navigate("/")}
				>
					Login{" "}
				</span>
				first
			</p>
		</div>
	);
};

export default Error;
