import { React, useEffect, useState, useContext, createContext } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdCreateNewFolder } from "react-icons/md";
import Spinner from "../../../../../../components/Spinner/Spinner.jsx";
import Error from "../../../../../../components/Error.jsx";
import AddNewFolderDiv from "./components/AddNewFolderDiv.jsx";
import Folders from "./components/Folders.jsx";
import DirectBackArrowHeader from "../../../../../../components/BackArrow/DirectBackArrowHeader.jsx";
import { ServerContext } from "../../../../../../App.js";
export const folderContext = createContext(null);

const FolderPage = () => {
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const { user, token } = useSelector((store) => store.auth);
	const { groupId } = useParams();
	const [folders, setFolders] = useState([]);
	const [showAddNewFolderDiv, setShowAddNewFolderDiv] = useState(false);
	const [isGroupAdmin, setIsGroupAdmin] = useState(false);
	const [loading, setLoading] = useState(false);

	// get all folders
	useEffect(() => {
		const retrieveFolders = async () => {
			try {
				setLoading(true);

				const res = await fetch(
					`${serverURL}/note/retrieve-folders?groupId=${groupId}`,
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

				const { msg, returnedFolders } = await res.json();

				if (msg === "Success") {
					setFolders(returnedFolders);
				} else if (msg === "Fail to retreive folders") {
					enqueueSnackbar("Fail to retreive folders", {
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
		retrieveFolders();
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
		<folderContext.Provider value={{ folders, setFolders }}>
			<div className="page-layout-with-back-arrow relative">
				{/* HEADER */}
				<DirectBackArrowHeader
					destination={`/group/${groupId}`}
					title="Folder"
				/>
				{/* FOLDERS */}
				{loading ? <Spinner /> : <Folders folders={folders} />}
				{/* ADD NEW FOLDER BUTTON */}
				{isGroupAdmin && (
					<button
						className="btn-green absolute flex items-center right-1 top-1"
						onClick={() => setShowAddNewFolderDiv((prev) => !prev)}
					>
						<MdCreateNewFolder className="mr-2" /> New Folder
					</button>
				)}

				{/* ADD NEW FOLDER DIV */}
				{showAddNewFolderDiv && (
					<AddNewFolderDiv setShowAddNewFolderDiv={setShowAddNewFolderDiv} />
				)}
			</div>
		</folderContext.Provider>
	) : (
		<Error />
	);
};

export default FolderPage;
