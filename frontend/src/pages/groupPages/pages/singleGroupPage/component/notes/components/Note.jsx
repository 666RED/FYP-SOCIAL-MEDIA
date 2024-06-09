import { React, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { MdDeleteForever } from "react-icons/md";
import Spinner from "../../../../../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../../../../../App.js";
import { noteContext } from "../pages/NotePage.jsx";

const Note = ({ note, count }) => {
	const serverURL = useContext(ServerContext);
	const [loading, setLoading] = useState(false);
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const { isGroupAdmin, notes, setNotes } = useContext(noteContext);
	const { groupId } = useParams();

	const handleDownload = () => {
		window.open(note.filePath, "_blank");
	};

	const handleRemove = async () => {
		try {
			const ans = window.confirm("Remove note?");

			if (ans) {
				setLoading(true);

				const res = await fetch(`${serverURL}/note/remove-note`, {
					method: "DELETE",
					body: JSON.stringify({
						noteId: note._id,
						filePath: note.filePath,
						groupId: groupId,
					}),
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

				const { msg, noteId } = await res.json();

				if (msg === "Success") {
					enqueueSnackbar("Note removed", {
						variant: "success",
					});
					const newNotes = notes.filter((note) => note._id !== noteId);
					setNotes(newNotes);
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}

				setLoading(false);
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	return (
		<tr>
			<td className="text-center">{count}</td>
			<td>
				<p
					className="cursor-pointer hover:opacity-70 inline"
					onClick={handleDownload}
				>
					{note.noteOriginalName}
				</p>
			</td>
			<td>{note.uploaded}</td>
			{isGroupAdmin && (
				<td>
					<MdDeleteForever
						className="mx-auto cursor-pointer text-red-600 hover:opacity-70 text-2xl"
						onClick={handleRemove}
					/>
				</td>
			)}
			{loading && <Spinner />}
		</tr>
	);
};

export default Note;
