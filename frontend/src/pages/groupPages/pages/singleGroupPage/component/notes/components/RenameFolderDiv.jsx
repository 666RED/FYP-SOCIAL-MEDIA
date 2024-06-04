import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { MdCancel } from "react-icons/md";
import Spinner from "../../../../../../../components/Spinner/Spinner.jsx";
import Filter from "../../../../../../../components/Filter.jsx";
import HorizontalRule from "../../../../../../../components/HorizontalRule.jsx";
import { ServerContext } from "../../../../../../../App.js";
import { folderContext } from "../FolderPage.jsx";

const RenameFolderDiv = ({
	setShowOptionDiv,
	setShowRenameFolderDiv,
	folder,
}) => {
	const { token } = useSelector((store) => store.auth);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(folder.name);
	const [discardChanges, setDiscardChanges] = useState(false);
	const { folders, setFolders } = useContext(folderContext);

	const handleRename = async (e) => {
		e.preventDefault();
		try {
			if (name.trim().length < 0) {
				enqueueSnackbar("Please enter folder name", {
					variant: "warning",
				});
				return;
			}

			setLoading(true);

			const res = await fetch(`${serverURL}/note/rename-folder`, {
				method: "PATCH",
				body: JSON.stringify({ folderId: folder._id, name: name.trim() }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				setLoading(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnedFolder } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Folder renamed", {
					variant: "success",
				});
				setShowOptionDiv(false);
				setShowRenameFolderDiv(false);
				setFolders(
					folders.map((folder) =>
						folder._id === returnedFolder._id ? returnedFolder : folder
					)
				);
			} else if (msg === "Fail to rename folder") {
				enqueueSnackbar("Fail to rename folder", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (discardChanges) {
			const ans = window.confirm("Discard changes?");

			if (ans) {
				setShowRenameFolderDiv(false);
			}
		} else {
			setShowRenameFolderDiv(false);
		}
	};

	return (
		<div className="center-container items-center px-2 folder-action">
			{loading && <Spinner />}
			<Filter />
			<form
				className="bg-white rounded-xl shadow-2xl z-40 p-2 w-2/3 md:w-1/2 lg:w-1/3 relative"
				onSubmit={handleRename}
			>
				{/* TITLE */}
				<h2 className="text-center font-semibold">Rename Folder</h2>
				<HorizontalRule />
				{/* INPUT */}
				<input
					className="border border-gray-600 w-full my-3"
					type="text"
					required
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						setDiscardChanges(true);
					}}
					placeholder="Folder name"
					maxLength={50}
				/>
				{/* RENAME BUTTON */}
				<button className="btn-green mx-auto mt-3 w-full">RENAME</button>
				{/* CANCEL ICON */}
				<MdCancel
					className="cancel-icon top-1 right-1"
					onClick={handleCancel}
				/>
			</form>
		</div>
	);
};

export default RenameFolderDiv;
