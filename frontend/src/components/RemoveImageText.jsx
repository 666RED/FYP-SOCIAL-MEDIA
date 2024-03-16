import React from "react";

const RemoveImageText = ({ imagePath, handleRemove }) => {
	return (
		<div>
			{imagePath !== "" && (
				<p
					className="text-red-600 cursor-pointer hover:opacity-80"
					onClick={handleRemove}
				>
					Remove
				</p>
			)}
		</div>
	);
};

export default RemoveImageText;
