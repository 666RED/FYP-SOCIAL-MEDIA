import React, { useContext } from "react";
import Note from "./Note.jsx";
import { noteContext } from "../pages/NotePage.jsx";

const Notes = () => {
	const { notes, isGroupAdmin } = useContext(noteContext);

	return (
		<table className="mt-6 w-full min-w-max">
			{/* HEADER */}
			<thead className="sticky top-0">
				<tr>
					<th>#</th>
					<th className="text-left">Note</th>
					<th className="text-left">Uploaded</th>
					{isGroupAdmin && <th>Operation</th>}
				</tr>
			</thead>
			{/* BODY */}
			<tbody>
				{notes.length > 0 ? (
					notes.map((note, index) => (
						<Note note={note} key={note._id} count={index + 1} />
					))
				) : (
					<tr>
						<td colSpan={4} className="text-center font-semibold text-xl">
							No note
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default Notes;
