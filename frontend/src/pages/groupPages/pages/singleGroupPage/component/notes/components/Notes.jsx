import React, { useState, useContext } from "react";
import Note from "./Note.jsx";
import { noteContext } from "../pages/NotePage.jsx";

const Notes = () => {
	const { notes, isGroupAdmin, setNotes } = useContext(noteContext);

	return (
		<table className="mt-8 w-full min-w-max">
			<thead>
				<tr>
					<th>#</th>
					<th className="text-left">Note</th>
					<th className="text-left">Uploaded</th>
					{isGroupAdmin && <th>Operation</th>}
				</tr>
			</thead>
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
