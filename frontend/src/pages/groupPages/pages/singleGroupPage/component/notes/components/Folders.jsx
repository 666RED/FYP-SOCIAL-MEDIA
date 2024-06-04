import React from "react";
import Folder from "./Folder.jsx";

const Folders = ({ folders }) => {
	return (
		<div className="mt-8 mb-2 grid grid-cols-12 gap-x-3 gap-y-7">
			{folders.length > 0 ? (
				folders.map((folder) => <Folder folder={folder} key={folder._id} />)
			) : (
				<h2 className="col-span-12">No folder</h2>
			)}
		</div>
	);
};

export default Folders;
