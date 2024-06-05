import { React, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServerContext } from "../../../../../App.js";

const DiscoverGroup = ({ group }) => {
	const serverURL = useContext(ServerContext);
	const [numOfMembers, setNumOfMembers] = useState(
		Object.keys(group.members).length
	);
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(`/group/${group._id}`);
	};

	return (
		<div
			className="flex md:flex-col items-center col-span-12 md:col-span-4 lg:col-span-3 border border-gray-300 rounded-xl shadow-xl my-3 px-2 md:py-2 hover:bg-gray-200 cursor-pointer"
			onClick={handleNavigate}
		>
			<img
				src={group.groupImagePath}
				alt="Group image"
				className="max-w-20 md:max-w-24 border border-gray-400 rounded-xl my-2"
			/>
			<div className="ml-2">
				<p className="font-semibold">{group.groupName}</p>
				<p>
					{numOfMembers} {numOfMembers > 1 ? "members" : "member"}
				</p>
			</div>
		</div>
	);
};

export default DiscoverGroup;
