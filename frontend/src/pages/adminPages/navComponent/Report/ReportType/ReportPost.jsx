import { React, useContext } from "react";
import { FaFile } from "react-icons/fa";
import PostHeader from "../../../components/PostHeader.jsx";
import { ServerContext } from "../../../../../App.js";

const ReportPost = ({ target, type }) => {
	const serverURL = useContext(ServerContext);

	const handleDownload = () => {
		window.open(target.postFilePath, "_blank");
	};

	return (
		<div>
			{/* HEADER */}
			<PostHeader
				imagePath={target.profileImagePath}
				time={target.time}
				userName={target.userName}
			/>
			{/* POST DESCRIPTION */}
			<p className="my-3">{target.postDescription}</p>
			{/* POST IMAGE */}
			{type === "Group Post" ? (
				target.postImagePath !== "" ? (
					<img
						src={target.postImagePath}
						alt="Post image"
						className="rounded-xl mx-auto w-full"
					/>
				) : target.postFilePath !== "" ? (
					<div
						className={`border-gray-600 rounded-xl flex items-center justify-center my-2`}
					>
						<div
							className="flex items-center border border-gray-600 w-full p-2 rounded-xl overflow-x-auto cursor-pointer hover:opacity-80"
							onClick={handleDownload}
						>
							<FaFile className="mr-2" />
							{target.postFilePath.split("\\").pop()}
						</div>
					</div>
				) : (
					<div></div>
				)
			) : (
				target.postImagePath !== "" && (
					<img
						src={target.postImagePath}
						alt="Post image"
						className="rounded-xl mx-auto w-full"
					/>
				)
			)}
		</div>
	);
};

export default ReportPost;
