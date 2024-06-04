import React, { useState } from "react";
import { FaFile } from "react-icons/fa";
import { useSnackbar } from "notistack";
import Spinner from "./Spinner/Spinner.jsx";

const UploadFile = ({
	filePath = "",
	dispatch,
	editFile = false,
	isRequired = false,
}) => {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleClick = () => {
		const file = document.getElementById("note-file");
		file.click();
	};

	const handleFileChange = (event) => {
		setLoading(true);
		const file = event.target.files[0];
		const maxSizeInBytes = 100 * 1024 * 1024; // 100MB

		if (file) {
			if (file.size > maxSizeInBytes) {
				enqueueSnackbar("File size should not greater than 100MB", {
					variant: "warning",
				});
				setLoading(false);
				return;
			}
			const newFilePath = URL.createObjectURL(file);

			dispatch({ filePath: newFilePath, file: file });
			setLoading(false);
		}
	};

	return (
		<div
			className={`border-gray-600 rounded-xl flex items-center justify-center cursor-pointer my-2 hover:opacity-80 ${
				filePath === "" && "py-5 border"
			}`}
			onClick={handleClick}
		>
			{loading && <Spinner />}
			{filePath !== "" ? (
				<div className="flex items-center border border-gray-600 w-full p-2 rounded-xl overflow-x-auto">
					<FaFile className="mr-2 flex-shrink-0" />
					{editFile
						? filePath.split("\\").pop()
						: document.getElementById("note-file").value.split("\\").pop()}
				</div>
			) : (
				<div className="flex items-center">
					<FaFile className="mr-2" />
					<p>Upload file</p>
				</div>
			)}

			<input
				className="hidden"
				type="file"
				id="note-file"
				name="note-file"
				accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.txt"
				onChange={handleFileChange}
				required={isRequired}
			/>
		</div>
	);
};

export default UploadFile;
