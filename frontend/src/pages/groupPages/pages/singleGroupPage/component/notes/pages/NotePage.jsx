import React, { useEffect, useState, useContext, createContext } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import DirectBackArrowHeader from "../../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import Error from "../../../../../../../components/Error.jsx";
import AddNewNote from "../components/AddNewNote.jsx";
import Notes from "../components/Notes.jsx";
import Spinner from "../../../../../../../components/Spinner/Spinner.jsx";
import { ServerContext } from "../../../../../../../App.js";
export const noteContext = createContext(null);

const NotePage = () => {
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const { groupId, folderId, view } = useParams();
	const [showAddNewNoteDiv, setShowAddNewNoteDiv] = useState(false);
	const [loading, setLoading] = useState(true);
	const { user, token } = useSelector((store) => store.auth);
	const [notes, setNotes] = useState([]);
	const [isGroupAdmin, setIsGroupAdmin] = useState(false);

	useEffect(() => {
		const retrieveNotes = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/note/retrieve-notes?folderId=${folderId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setLoading(false);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnedNotes } = await res.json();

				if (msg === "Success") {
					setNotes(returnedNotes);
				} else if (msg === "Fail to retrieve notes") {
					enqueueSnackbar("Fail to retrieve notes", { variant: "error" });
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

		retrieveNotes();
	}, []);

	// is group admin
	useEffect(() => {
		const getGroupAdminId = async () => {
			try {
				const res = await fetch(
					`${serverURL}/group/get-group-admin-id?groupId=${groupId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg, returnGroupAdminId } = await res.json();

				if (msg === "Success") {
					if (returnGroupAdminId === user._id) {
						setIsGroupAdmin(true);
					} else {
						setIsGroupAdmin(false);
					}
				} else if (msg === "Group not found") {
					enqueueSnackbar("Group not found", { variant: "error" });
				} else {
					enqueueSnackbar("An error occurred", { variant: "error" });
				}
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
			}
		};

		getGroupAdminId();
	}, []);

	return user && token ? (
		<noteContext.Provider value={{ notes, isGroupAdmin, setNotes }}>
			<div className="page-layout-with-back-arrow relative">
				{/* HEADER */}
				<DirectBackArrowHeader
					destination={view == 1 ? "/home" : `/group/${groupId}/view-notes`}
					title="View Notes"
				/>
				{/* NOTES */}
				{loading ? (
					<Spinner />
				) : (
					<div className="overflow-x-auto">
						<Notes />
					</div>
				)}
				{/* ADD NEW NOTE BUTTON */}
				{isGroupAdmin && (
					<button
						className="btn-green flex items-center absolute top-1 right-1"
						onClick={() => setShowAddNewNoteDiv((prev) => !prev)}
					>
						<BsFileEarmarkPlusFill className="mr-2" />
						New Note
					</button>
				)}

				{/* ADD NEW NOTE DIV */}
				{showAddNewNoteDiv && (
					<AddNewNote setShowAddNewNoteDiv={setShowAddNewNoteDiv} />
				)}
			</div>
		</noteContext.Provider>
	) : (
		<Error />
	);
};

export default NotePage;
