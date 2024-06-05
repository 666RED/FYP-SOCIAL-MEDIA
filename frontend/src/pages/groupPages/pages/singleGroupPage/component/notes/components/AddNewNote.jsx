import { React, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import UploadFile from "../../../../../../../components/UploadFile.jsx";
import Spinner from "../../../../../../../components/Spinner/Spinner.jsx";
import Filter from "../../../../../../../components/Filter.jsx";
import HorizontalRule from "../../../../../../../components/HorizontalRule.jsx";
import { ServerContext } from "../../../../../../../App.js";
import { noteContext } from "../pages/NotePage.jsx";

const AddNewNote = ({ setShowAddNewNoteDiv }) => {
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [filePath, setFilePath] = useState("");
	const [file, setFile] = useState({});
	const [discardChanges, setDiscardChanges] = useState(false);
	const { folderId } = useParams();
	const { token } = useSelector((store) => store.auth);
	const { notes, setNotes } = useContext(noteContext);

	const uploadFile = ({ filePath, file }) => {
		setFile(file);
		setFilePath(filePath);
		setDiscardChanges(true);
	};

	const handleCancel = () => {
		if (discardChanges) {
			const ans = window.confirm("Discard changes?");

			if (ans) {
				setShowAddNewNoteDiv(false);
			}
		} else {
			setShowAddNewNoteDiv(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const formdata = new FormData();

			formdata.append("folderId", folderId);
			formdata.append("file", file);

			const res = await fetch(`${serverURL}/note/create-new-note`, {
				method: "POST",
				body: formdata,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				setLoading(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, returnedNote } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("New note uploaded", {
					variant: "success",
				});
				setShowAddNewNoteDiv(false);
				setNotes([...notes, returnedNote]);
			} else if (msg === "Fail to upload new note") {
				enqueueSnackbar("Fail to upload new note", { variant: "error" });
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

	return (
		<div className="center-container items-center px-2">
			{loading && <Spinner />}
			<Filter />
			<form
				className="bg-white rounded-xl shadow-2xl z-40 p-2 w-2/3 md:w-1/2 lg:w-1/3 relative"
				onSubmit={handleSubmit}
			>
				{/* TITLE */}
				<h2 className="text-center font-semibold">Upload Note</h2>
				<HorizontalRule />
				{/* UPLOAD FILE */}
				<UploadFile
					dispatch={uploadFile}
					filePath={filePath}
					isRequired={true}
				/>
				{/* UPLOAD BUTTON */}
				<button className="btn-green mx-auto mt-3 w-full">UPLOAD</button>
				{/* CANCEL ICON */}
				<MdCancel
					className="cancel-icon top-1 right-1"
					onClick={handleCancel}
				/>
			</form>
		</div>
	);
};

export default AddNewNote;
