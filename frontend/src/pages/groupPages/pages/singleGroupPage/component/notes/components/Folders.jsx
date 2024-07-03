import { React, useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Folder from "./Folder.jsx";
import { ServerContext } from "../../../../../../../App.js";

const Folders = ({ folders }) => {
	const { user, token } = useSelector((store) => store.auth);
	const serverURL = useContext(ServerContext);
	const [isGroupAdmin, setIsGroupAdmin] = useState(false);
	const { groupId } = useParams();
	const { enqueueSnackbar } = useSnackbar();

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

	return (
		<div className="mt-8 mb-2 grid grid-cols-12 gap-x-3 gap-y-7">
			{folders.length > 0 ? (
				folders.map((folder) => (
					<Folder
						folder={folder}
						key={folder._id}
						isGroupAdmin={isGroupAdmin}
					/>
				))
			) : (
				<h2 className="col-span-12">No folder</h2>
			)}
		</div>
	);
};

export default Folders;
