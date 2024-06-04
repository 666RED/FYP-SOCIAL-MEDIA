import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FaFolder } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs/index.js";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import RenameFolderDiv from "./RenameFolderDiv.jsx";
import OptionDiv from "../../../../../../../components/OptionDiv.jsx";
import Spinner from "../../../../../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../../../../../App.js";
import { folderContext } from "../FolderPage.jsx";

const Folder = ({ folder }) => {
	const { token } = useSelector((store) => store.auth);
	const [loading, setLoading] = useState(false);
	const serverURL = useContext(ServerContext);
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [showOptionDiv, setShowOptionDiv] = useState(false);
	const [showRenameFolderDiv, setShowRenameFolderDiv] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const { folders, setFolders } = useContext(folderContext);

	const handleNavigate = (e) => {
		if (!e.target.closest(".folder-action")) {
			navigate(`/group/${groupId}/view-notes/${folder._id}`);
		}
	};

	const handleShowOptionDiv = (e) => {
		e.stopPropagation();
		setShowOptionDiv((prev) => !prev);
	};

	const handleRemoveFolder = async (e) => {
		e.stopPropagation();
		try {
			const ans = window.confirm(`Remove ${folder.name}?`);

			if (ans) {
				setLoading(true);
				const res = await fetch(`${serverURL}/note/remove-folder`, {
					method: "DELETE",
					body: JSON.stringify({ folderId: folder._id }),
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

				const { msg, folderId } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Folder removed", { variant: "success" });
					setShowOptionDiv(false);
					setFolders(folders.filter((folder) => folder._id !== folderId));
				} else if (
					msg === "Fail to remove notes" ||
					msg === "Fail to remove folder"
				) {
					enqueueSnackbar("Fail to remove folder", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	const handleShowRenameDiv = (e) => {
		e.stopPropagation();
		setShowRenameFolderDiv(true);
	};

	return (
		<div
			className={`col-span-6 md:col-span-4 lg:col-span-3 rounded-xl bg-gray-200 py-2 pl-3 pr-6 ${
				!showRenameFolderDiv && "cursor-pointer"
			} min-h-32 shadow-xl relative`}
			onClick={handleNavigate}
		>
			{loading && <Spinner />}
			<div className="flex">
				{/* FOLDER ICON */}
				<FaFolder className="mr-2 text-xl" />
				{/* FOLDER NAME */}
				<p className="md:text-xl font-semibold">{folder.name}</p>
			</div>
			{/* NOTES NUMBER */}
			<h3 className="text-center mt-4">
				{folder.numberOfNotes === 0
					? "No note"
					: folder.numberOfNotes + " notes"}
			</h3>
			{/* OPTION DIV */}
			{showOptionDiv && (
				<div className="option-div-container right-1 top-6 bg-white">
					{/* RENAME */}
					<OptionDiv
						func={handleShowRenameDiv}
						icon={<MdEdit />}
						text="Rename"
					/>
					{/* REMOVE */}
					<OptionDiv
						func={handleRemoveFolder}
						icon={<MdDeleteForever />}
						text="Remove"
					/>
				</div>
			)}
			{/* THREE DOTS */}
			<BsThreeDots
				className="absolute cursor-pointer top-2 right-2"
				onClick={handleShowOptionDiv}
			/>
			{/* RENAME FOLDER DIV */}
			{showRenameFolderDiv && (
				<RenameFolderDiv
					folder={folder}
					setShowOptionDiv={setShowOptionDiv}
					setShowRenameFolderDiv={setShowRenameFolderDiv}
				/>
			)}
		</div>
	);
};

export default Folder;
