import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import Filter from "../../../../../../../components/Filter.jsx";
import Spinner from "../../../../../../../components/Spinner/Spinner.jsx";
import HorizontalRule from "../../../../../../../components/HorizontalRule.jsx";
import { ServerContext } from "../../../../../../../App.js";
import { folderContext } from "../FolderPage.jsx";

const AddNewFolderDiv = ({ setShowAddNewFolderDiv }) => {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const serverURL = useContext(ServerContext);
	const { groupId } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useSelector((store) => store.auth);
	const [discardChanges, setDiscardChanges] = useState(false);
	const { folders, setFolders } = useContext(folderContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			if (name.trim().length < 1) {
				enqueueSnackbar("Please enter file name", { variant: "warning" });
				return;
			}

			const res = await fetch(`${serverURL}/note/create-new-folder`, {
				method: "POST",
				body: JSON.stringify({ folderName: name.trim(), groupId: groupId }),
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
				enqueueSnackbar("New folder created", {
					variant: "success",
				});
				setShowAddNewFolderDiv(false);
				setFolders([...folders, returnedFolder]);
			} else if (msg === "Fail to create new folder") {
				enqueueSnackbar("Fail to create new folder", {
					variant: "error",
				});
			} else if (msg === "Folder name is already in use") {
				enqueueSnackbar("Folder name is already in use", {
					variant: "error",
				});
				document.querySelector("#name-input").focus();
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
				setShowAddNewFolderDiv(false);
			}
		} else {
			setShowAddNewFolderDiv(false);
		}
	};

	return (
		<div className="center-container items-center px-2">
			{loading && <Spinner />}
			<Filter />
			<form
				className="bg-white rounded-xl shadow-2xl z-40 p-2 w-2/3 md:w-1/2 lg:w-1/3 relative"
				onSubmit={handleSubmit}
			>
				{/* TITLE */}
				<h2 className="text-center font-semibold">Create Folder</h2>
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
					id="name-input"
				/>
				{/* CREATE BUTTON */}
				<button className="btn-green mx-auto mt-3 w-full">CREATE</button>
				{/* CANCEL ICON */}
				<MdCancel
					className="cancel-icon top-1 right-1"
					onClick={handleCancel}
				/>
			</form>
		</div>
	);
};

export default AddNewFolderDiv;
